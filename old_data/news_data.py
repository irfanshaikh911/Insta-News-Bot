import pandas as pd
import requests
from bs4 import BeautifulSoup
import ast

from transformers import pipeline

# Load summarizer model (BART is great for general news text)
summarizer_model = pipeline("summarization", model="facebook/bart-large-cnn")


# Fallback scraping function to extract text from articles
def fallback_scrape(url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Try common article tags
        paragraphs = soup.find_all('p')
        full_text = ' '.join([p.get_text() for p in paragraphs])
        return full_text.strip()
    
def safe_fallback_scrape(url):
    try:
        resp = requests.get(url)
        if resp.status_code == 200:
            return fallback_scrape(url)
        else:
            return " "
    except Exception as e:
        print(f"[!] Error fetching {url}: {e}")
        return " "
    
def summarize_text(input_text):
    max_input_length = 1024
    inputs = summarizer_model.tokenizer.encode(input_text, return_tensors='pt', truncation=True,max_length=max_input_length)
    decoded_input = summarizer_model.tokenizer.decode(inputs[0], skip_special_tokens=True)
    result = summarizer_model(decoded_input, max_length=250)
    return result



def extract_thumbnail(image_str):
    """
    Safely parses a stringified dictionary and extracts the 'thumbnail' URL.
    Returns None if parsing fails or 'thumbnail' is not present.
    """
    try:
        data_dict = ast.literal_eval(image_str)
        return data_dict.get('thumbnail')
    except (ValueError, SyntaxError):
        return None



def extract_data(df):
    # df = pd.DataFrame(data['items'])[['title', 'snippet', 'images', 'hasSubnews', 'newsUrl', 'publisher']]
    df['summary'] = df['newsUrl'].map(safe_fallback_scrape)
    # df['summary'] = df['newsUrl'].map(lambda x: fallback_scrape(x) if requests.get(x).status_code == 200 else "")
    # df['summary'] = df['newsUrl'].map
    df['full_news_summary'] =df['title']+ df['snippet']+df['summary']
    df['full_news_summary'] = df['full_news_summary'].replace(r'[^a-zA-Z0-9\s]+', '', regex = True).str.split().map(lambda x : ' '.join(x)).str.strip()
    # df['text'] = df['full_news_summary']
    df['summarization'] = df['full_news_summary'].apply(lambda x:summarize_text(x))
    df['images'] = df['images'].apply(lambda x: extract_thumbnail(x))
    df.drop(columns=['summary','full_news_summary','snippet','hasSubnews','snippet'], inplace=True)
    return df.to_csv('data\data.csv',index=False)



