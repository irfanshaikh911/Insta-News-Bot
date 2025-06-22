from transformers import pipeline

# Load summarizer model (BART is great for general news text)
summarizer_model = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text,ma)