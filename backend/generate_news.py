import pandas as pd
import feedparser
import re
import os
from newspaper import Article
from tqdm import tqdm

tech_rss_feeds = {
    "India": {
        "The Hindu (National)": "https://www.thehindu.com/news/national/",
        "India Today Tech": "https://www.indiatoday.in/technology/rss",
        "NDTV Gadgets 360": "https://gadgets360.com/rss/news",
        "YourStory": "https://yourstory.com/feed",
        "The Hindu - Technology": "https://www.thehindu.com/sci-tech/technology/feeder/default.rss"
    },
    "World": {
        "BBC Technology": "http://feeds.bbci.co.uk/news/technology/rss.xml",
        "NY Times Tech": "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
        "Forbes Tech": "https://www.forbes.com/tech/feed/",
        "Quartz Tech": "https://qz.com/tech/feed",
        "MIT Technology Review": "https://www.technologyreview.com/feed/",
        "SingularityHub": "https://singularityhub.com/feed/"
    },
    "Movies": {
        "The Hindu (Entertainment)": "https://www.thehindu.com/entertainment/",
        "OneVision": "https://onevisionmedia.in/",
        "NDTV Bolly": "https://www.ndtv.com/entertainment/bollywood/",
        "NDTV News": "https://www.ndtv.com/entertainment/",
        "Danik Bhaskar": "https://www.bhaskar.com/entertainment/bollywood/",
        "Bollywood Hungama": "https://www.bollywoodhungama.com/news/bollywood",
        "South Cinema Hungama": "https://www.bollywoodhungama.com/south-cinema/",
        "OTT Hongama": "https://www.bollywoodhungama.com/tag/ott/",
        "Tevision News": "https://www.bollywoodhungama.com/tag/television/"
    },
    "Sports": {
        "The Hindu (Sports)": "https://www.thehindu.com/sport/",
        "ESPN": "https://www.espn.com/espn/rss/news",
        "BBC Sport": "http://feeds.bbci.co.uk/sport/rss.xml",
        "Sky Sports": "https://www.skysports.com/rss/12040"
    },
    "Technology": {
        "TechCrunch": "https://techcrunch.com/feed/",
        "The Verge": "https://www.theverge.com/rss/index.xml",
        "Wired": "https://www.wired.com/feed/rss",
        "Mashable": "https://mashable.com/feed/",
        "CNET": "https://www.cnet.com/rss/all/",
        "Engadget": "https://www.engadget.com/rss.xml",
        "Gizmodo": "https://gizmodo.com/rss",
        "Digital Trends": "https://www.digitaltrends.com/feed/",
        "The Next Web (TNW)": "https://thenextweb.com/feed/",
        "ZDNet": "https://www.zdnet.com/news/rss.xml",
        "InformationWeek": "https://www.informationweek.com/rss.xml",
        "VentureBeat": "https://venturebeat.com/feed/",
        "Product Hunt": "https://www.producthunt.com/feed",
        "Android Authority": "https://www.androidauthority.com/feed/",
        "9to5Mac": "https://9to5mac.com/feed/",
        "9to5Google": "https://9to5google.com/feed/",
        "Fossbytes": "https://fossbytes.com/feed/",
        "OMG! Ubuntu": "https://www.omgubuntu.co.uk/feed",
        "Ars Technica": "http://feeds.arstechnica.com/arstechnica/index",
        "Slashdot": "http://rss.slashdot.org/Slashdot/slashdot"
    },
    "Health": {
        "WHO News": "https://www.who.int/feeds/entity/mediacentre/news/en/rss.xml",
        "Medical News Today": "https://www.medicalnewstoday.com/rss",
        "WebMD Health": "https://rss.medscape.com/webmd/topic_feed"
    }
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

def extract_full_article(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.text[:2000]  # Optional limit
    except:
        return ""

def fetch_news():
    all_articles = []

    for category, sources in tech_rss_feeds.items():
        for publisher, url in sources.items():
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries[:5]:
                    article_url = entry.get("link", "")
                    full_story = extract_full_article(article_url)

                    all_articles.append({
                        "title": entry.get("title", ""),
                        "summary": re.sub("<[^<]+?>", "", entry.get("summary", ""))[:300],
                        "url": article_url,
                        "publisher": publisher,
                        "image": extract_image(entry),
                        "category": category,
                        "full_story": full_story
                    })
            except Exception as e:
                print(f"Error parsing {publisher} ({category}): {e}")

    df = pd.DataFrame(all_articles)
    df.drop_duplicates(subset=["title", "url"], inplace=True)
    df['has_image'] = df['image'].notnull()
    df = df.sort_values(by='has_image', ascending=False).drop(columns='has_image')

    os.makedirs("insta-bot-ui/public", exist_ok=True)
    df.to_csv("insta-bot-ui/public/news_feed.csv", index=False)
    print(f"✅ news_feed.csv created with {len(df)} articles")

if __name__ == "__main__":
    fetch_news()
