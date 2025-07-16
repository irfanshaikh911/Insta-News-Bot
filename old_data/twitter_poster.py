import os
import tweepy
from dotenv import load_dotenv

load_dotenv()

def post_to_twitter(title, summary, url):
    tweet = f"{title}\n\n{summary[:200]}...\n\nRead more: {url}"
    print("API KEY:", os.getenv("X_API_KEY"))
    print("API SECRET:", os.getenv("X_API_SECRET"))
    print("ACCESS TOKEN:", os.getenv("X_ACCESS_TOKEN"))
    print("ACCESS TOKEN SECRET:", os.getenv("X_ACCESS_TOKEN_SECRET"))

    auth = tweepy.OAuth1UserHandler(
        os.getenv("X_API_KEY"),
        os.getenv("X_API_SECRET"),
        os.getenv("X_ACCESS_TOKEN"),
        os.getenv("X_ACCESS_TOKEN_SECRET")
    )

    api = tweepy.API(auth)

    # Post the tweet (uses API v1.1 endpoint)
    api.update_status(status=tweet)

    return "Tweet posted successfully!"
