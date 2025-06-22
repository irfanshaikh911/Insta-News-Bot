import requests
from bs4 import BeautifulSoup

def get_trending_tech_hashtags():
    url = "https://best-hashtags.com/hashtag/tech/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    tags_div = soup.find("div", {"class": "tag-box tag-box-v3 margin-bottom-40"})
    if tags_div:
        raw_tags = tags_div.text.strip()
        return " ".join(raw_tags.split()[:15])  # top 15
    return "#technology #technews #gadgets"
