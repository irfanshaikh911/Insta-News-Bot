
from instabot import Bot
insta = Bot()
# Login to Instagram account   

def login_to_instagram(user, key):
    try:
        insta.login(username=user, password=key)
        print("Login successful!")
    except Exception as e:
        print(f"An error occurred during login: {e}") 