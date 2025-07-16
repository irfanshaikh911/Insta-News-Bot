from flask import Flask, request, jsonify
from flask_cors import CORS
from insta_bot import post_to_instagram, submit_challenge_code

app = Flask(__name__)
CORS(app)  # Allow React frontend

@app.route("/post", methods=["POST"])
def post_now():
    try:
        data = request.get_json()
        title = data.get("title")
        summary = data.get("summary")
        url = data.get("url")
        image = data.get("image")

        if not all([title, summary, url, image]):
            return jsonify({"success": False, "error": "Missing required fields"}), 400

        caption = f"{title}\n\n{summary}\n\nRead more: {url}\n\n#news #update #breaking"

        result = post_to_instagram(caption, image)
        return jsonify({"success": result})
    
    except Exception as e:
        if "challenge_required" in str(e).lower():
            return jsonify({"challenge_required": True})
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

if __name__ == "__main__":
    app.run(debug=True, threaded=False)  # Force single-threaded to avoid instagrapi issues
