import requests
from bs4 import BeautifulSoup
# from transformers import pipeline

# Load summarizer model (BART is great for general news text)
# summarizer_model = pipeline("summarization", model="facebook/bart-large-cnn")

# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# model_name = "sshleifer/distilbart-cnn-12-6"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer   
from sumy.summarizers.text_rank import TextRankSummarizer

def fallback_scrape(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Try common article tags
        paragraphs = soup.find_all('p')
        full_text = ' '.join([p.get_text() for p in paragraphs])
        return summarize_text(full_text.strip())
    
    except Exception as e:
        print(f"[!] Error fetching at fallback_scrape{url}: {e}")
    return " "

def safe_fallback_scrape(url):
    try:
        resp = requests.get(url)
        if resp.status_code == 200:
            return fallback_scrape(url)
        else:
            return " "
    except Exception as e:
        print(f"[!] Error fetching at safe fallback scrape {url}: {e}")
        return " "
   
# summarize_text using transformers pipeline 
# def summarize_text(input_text):
#     max_input_length = 1024
#     inputs = summarizer_model.tokenizer.encode(input_text, return_tensors='pt', truncation=True,max_length=max_input_length)
#     decoded_input = summarizer_model.tokenizer.decode(inputs[0], skip_special_tokens=True)
#     result = summarizer_model(decoded_input, max_length=250)
#     return result


# summarize_text_without_using_pipeline
# def summarize_text(text):
#     inputs = tokenizer.encode(text, return_tensors="pt", max_length=1024, truncation=True)
#     summary_ids = model.generate(inputs, max_length=150, min_length=30, length_penalty=2.0, num_beams=4)
#     summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
#     return summary


def summarize_text(text):
    if not text or len(text.split()) < 10:
        return text

    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = TextRankSummarizer()
    summary = summarizer(parser.document, sentences_count=2)
    return " ".join(str(sentence) for sentence in summary)


    