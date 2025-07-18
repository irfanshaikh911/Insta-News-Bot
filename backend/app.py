from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from insta_bot import post_to_instagram, submit_challenge_code
from ai_tools import generate_summary, generate_hashtags
# from text_to_speech import synthesize_speech
import io
import os, json, requests
from datetime import datetime
from dotenv import load_dotenv, set_key

app = Flask(__name__, static_folder='../frontend/dist', static_url_path="/")
CORS(app)

POSTED_FILE = "posted.json"
ENV_PATH = '.env'

load_dotenv()
ELASTIC_API_KEY = os.getenv("ELASTIC_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

@app.route('/')
def serve_root():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route("/save-instagram-login", methods=["POST"])
def save_instagram_login():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No JSON received'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    try:
        set_key(ENV_PATH, 'INSTA_USERNAME', username)
        set_key(ENV_PATH, 'INSTA_PASSWORD', password)
        return jsonify({'message': 'Login info saved'}), 200
    except Exception as e:
        print("Error saving to .env:", e)
        return jsonify({'error': 'Internal server error'}), 500

def log_post(title, summary, image, url, platform="instagram", status="Posted"):
    entry = {
        "title": title,
        "summary": summary,
        "image": image,
        "url": url,
        "platform": platform,
        "timestamp": datetime.utcnow().isoformat(),
        "status": status
    }
    try:
        data = []
        if os.path.exists(POSTED_FILE):
            with open(POSTED_FILE, "r") as f:
                data = json.load(f)
        data.append(entry)
        with open(POSTED_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print("Failed to log post:", e)

@app.route("/post", methods=["POST"])
def post_now():
    try:
        data = request.get_json()
        title = data.get("title")
        summary = data.get("summary")
        url = data.get("url")
        image = data.get("image")
        full_story = data.get("full_story")

        if not all([title, summary, url, image]):
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        improved_summary = generate_summary(full_story or summary)
        hashtags = generate_hashtags(full_story or summary)
        hashtag_str = " ".join(hashtags)
        caption = f"{title}\n\n{improved_summary}\n\nRead more: {url}\n\n{hashtag_str}"

        result = post_to_instagram(caption, image)
        status = "Posted" if result else "Failed"
        log_post(title, improved_summary, image, url, platform="instagram", status=status)

        return jsonify({"success": result, "caption": caption, "hashtags": hashtags})

    except Exception as e:
        if "challenge_required" in str(e).lower():
            return jsonify({"success": False, "challenge_required": True, "error": str(e)})
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/send-email", methods=["POST"])
def send_email():
    try:
        data = request.get_json()
        to = data.get("to")
        subject = data.get("subject")
        body = data.get("body")

        if not to or not subject or not body:
            return jsonify({"success": False, "error": "Missing email fields"}), 400

        payload = {
            "apikey": ELASTIC_API_KEY,
            "from": SENDER_EMAIL,
            "to": to,
            "subject": subject,
            "bodyText": body,
            "isTransactional": True
        }

        r = requests.post("https://api.elasticemail.com/v2/email/send", data=payload)
        response_data = r.json()
        if r.status_code == 200 and response_data.get("success"):
            return jsonify({"success": True})
        else:
            error_msg = response_data.get("message", r.text)
            return jsonify({"success": False, "error": error_msg}), 500

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/send-sms", methods=["POST"])
def send_sms():
    try:
        data = request.get_json()
        to = data.get("to")
        message = data.get("message")

        if not to or not message:
            return jsonify({"success": False, "error": "Missing SMS fields"}), 400

        sms_payload = {
            'authorization': os.getenv("FAST2SMS_API_KEY"),
            'message': message,
            'language': 'english',
            'route': 'q',
            'numbers': to.replace("+", "")
        }

        headers = {
            'cache-control': "no-cache"
        }

        r = requests.post("https://www.fast2sms.com/dev/bulkV2", data=sms_payload, headers=headers)
        response_data = r.json()

        if r.status_code == 200 and response_data.get("return") is True:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": response_data.get("message", "Unknown error")}), 500

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/submit-code", methods=["POST"])
def handle_challenge_code():
    try:
        data = request.get_json()
        code = data.get("code")
        if not code:
            return jsonify({"success": False, "error": "Code is required"}), 400

        submit_challenge_code(code)
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/posted", methods=["GET"])
def get_posted():
    if os.path.exists(POSTED_FILE):
        with open(POSTED_FILE, "r") as f:
            return jsonify(json.load(f))
    return jsonify([])

@app.route("/posted/<int:index>", methods=["DELETE"])
def delete_post(index):
    try:
        if os.path.exists(POSTED_FILE):
            with open(POSTED_FILE, "r") as f:
                data = json.load(f)
            if 0 <= index < len(data):
                data.pop(index)
                with open(POSTED_FILE, "w") as f:
                    json.dump(data, f, indent=2)
                return jsonify({"success": True})
        return jsonify({"error": "Invalid index"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/posted/<int:index>", methods=["PUT"])
def edit_post(index):
    try:
        new_data = request.get_json()
        if os.path.exists(POSTED_FILE):
            with open(POSTED_FILE, "r") as f:
                data = json.load(f)
            if 0 <= index < len(data):
                data[index].update(new_data)
                with open(POSTED_FILE, "w") as f:
                    json.dump(data, f, indent=2)
                return jsonify({"success": True})
        return jsonify({"error": "Invalid index"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
