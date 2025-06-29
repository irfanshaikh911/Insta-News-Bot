import json
import pandas as pd
import feedparser
import re

tech_feeds = {
        "TechCrunch": "https://techcrunch.com/feed/",
        "The Verge": "https://www.theverge.com/rss/index.xml",
        "Wired": "https://www.wired.com/feed/rss",
        "Mashable": "https://mashable.com/feed/",
        "CNET": "https://www.cnet.com/rss/all/",
        "Engadget": "https://www.engadget.com/rss.xml",
        "Gizmodo": "https://gizmodo.com/rss",
        "Digital Trends": "https://www.digitaltrends.com/feed/",
        "The Next Web (TNW)": "https://thenextweb.com/feed/",
        "The Hindu": "https://www.thehindu.com/news/national/",
        "VentureBeat": "https://venturebeat.com/feed/",
        "Product Hunt": "https://www.producthunt.com/feed",
        "The Hindu":"https://www.thehindu.com/entertainment/",
        "The Hindu":"https://www.thehindu.com/sport/",
        "Android Authority": "https://www.androidauthority.com/feed/",
        "9to5Mac": "https://9to5mac.com/feed/",
        "9to5Google": "https://9to5google.com/feed/",
        "ZDNet": "https://www.zdnet.com/news/rss.xml",
        "InformationWeek": "https://www.informationweek.com/rss.xml",
        "Fossbytes": "https://fossbytes.com/feed/",
        "OMG! Ubuntu": "https://www.omgubuntu.co.uk/feed",
        "MIT Technology Review": "https://www.technologyreview.com/feed/",
        "SingularityHub": "https://singularityhub.com/feed/",
        "India Today Tech": "https://www.indiatoday.in/technology/rss",
        "NDTV Gadgets 360": "https://gadgets360.com/rss/news",
        "YourStory": "https://yourstory.com/feed",
        "The Hindu - Technology": "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",
        "BBC Technology": "http://feeds.bbci.co.uk/news/technology/rss.xml",
        "NY Times Tech": "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
        "Forbes Tech": "https://www.forbes.com/tech/feed/",
        "Quartz Tech": "https://qz.com/tech/feed",
        "Ars Technica": "http://feeds.arstechnica.com/arstechnica/index",
        "Slashdot": "http://rss.slashdot.org/Slashdot/slashdot",
}

def extract_image(entry):
    try:
        if "media_content" in entry:
            return entry.media_content[0].get("url")
        elif "media_thumbnail" in entry:
            return entry.media_thumbnail[0].get("url")
        elif "summary" in entry and "<img" in entry.summary:
            match = re.search(r'<img.*?src="(.*?)"', entry.summary)
            return match.group(1) if match else None
    except:
        return None

def fetch_news():
    articles = []
    for source, url in tech_feeds.items():
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                articles.append({
                    "title": entry.get("title", ""),
                    "summary": re.sub("<[^<]+?>", "", entry.get("summary", ""))[:300],
                    "url": entry.get("link", ""),
                    "publisher": source,
                    "image": extract_image(entry)
                })
        except Exception as e:
            print(f"Error parsing {source}: {e}")

    df = pd.DataFrame(articles)
    df.to_csv("insta-bot-ui/public/news_feed.csv", index=False)
    print("✅ news_feed.csv created")

if __name__ == "__main__":
    fetch_news()
