import os
import requests
from instagrapi import Client
from instagrapi.exceptions import ChallengeRequired
from dotenv import load_dotenv

load_dotenv()

cl = Client()
SESSION_FILE = "session.json"
LOGGED_IN = False
CHALLENGE_PENDING = False


def login():
    global LOGGED_IN, CHALLENGE_PENDING
    username = os.getenv("INSTA_USERNAME")
    password = os.getenv("INSTA_PASSWORD")

    if LOGGED_IN:
        return

    try:
        if os.path.exists(SESSION_FILE):
            cl.load_settings(SESSION_FILE)
            cl.login(username, password)
        else:
            cl.set_locale("en_US")
            cl.set_country("US")
            cl.set_device({
                "app_version": "218.0.0.0.0",
                "android_version": 29,
                "android_release": "10.0",
                "dpi": "420dpi",
                "resolution": "1080x1920",
                "manufacturer": "Samsung",
                "device": "SM-G973F",
                "model": "Galaxy S10",
                "cpu": "exynos9820"
            })
            cl.login(username, password)
            cl.dump_settings(SESSION_FILE)

        LOGGED_IN = True

    except ChallengeRequired:
        # Trigger challenge and send code via email
        cl.challenge_resolve()
        cl.send_challenge_code_via_email()
        CHALLENGE_PENDING = True
        raise Exception("challenge_required")

    except Exception as e:
        raise Exception(f"Login failed: {e}")


def submit_challenge_code(code: str):
    try:
        cl.challenge_code_submit(code)
        cl.dump_settings(SESSION_FILE)
        global LOGGED_IN, CHALLENGE_PENDING
        LOGGED_IN = True
        CHALLENGE_PENDING = False
        return True
    except Exception as e:
        raise Exception(f"Challenge code failed: {e}")


def post_to_instagram(caption, image_url):
    login()

    # Download the image
    response = requests.get(image_url)
    if response.status_code != 200:
        raise Exception("Image download failed")

    with open("temp.jpg", "wb") as f:
        f.write(response.content)

    # Upload the image
    result = cl.photo_upload("temp.jpg", caption=caption)
    if not result:
        raise Exception("Upload failed. Instagram might have rejected the media.")
    return True
