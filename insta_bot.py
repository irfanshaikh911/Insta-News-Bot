from instabot import Bot
import os
import shutil

class InstaBotWrapper:
    def __init__(self):
        self.bot = None
        self.username = None

    def login(self, username, password):
        try:
            shutil.rmtree("config")
        except Exception:
            pass
        
        self.bot = Bot()
        self.username = username

        try:
            self.bot.login(username=username, password=password)
            print("✅ Login successful!")
            return True
        except Exception as e:
            print(f"❌ Login failed: {e}")
            return False

    def upload_image(self, image_path, caption):
        if self.bot:
            try:
                if not image_path.endswith(".jpg"):
                    new_path = image_path.replace(".png", ".jpg")
                    os.rename(image_path, new_path)
                    image_path = new_path
                self.bot.upload_photo(image_path, caption=caption)
                print("📸 Image uploaded successfully.")
                return True
            except Exception as e:
                print(f"❌ Failed to upload: {e}")
                return False
        return False

    def logout(self):
        if self.bot:
            self.bot.logout()
            print("👋 Logged out.")
