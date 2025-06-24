# from instabot import Bot
import os
from instabot import Bot

# Read credentials and caption
with open("insta_config.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
    username = lines[0].strip()
    password = lines[1].strip()
    caption = "".join(lines[2:]).strip()

# Clean up old config if exists
if os.path.exists("config"):
    import shutil
    shutil.rmtree("config")

# Prepare image
image_path = "news_card.png"
temp_image = image_path + ".REMOVE_ME"
if os.path.exists(image_path):
    os.rename(image_path, temp_image)

# Upload
bot = Bot()
bot.login(username=username, password=password)
bot.upload_photo(temp_image, caption=caption)
