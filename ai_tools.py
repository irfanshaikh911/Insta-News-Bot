from transformers import pipeline

# Load models once
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
tagger = pipeline("text-generation", model="gpt2")  # or your preferred model

def generate_summary(text):
    result = summarizer(
        text,
        max_new_tokens=60,   # ✅ controls only the output
        min_length=20,
        do_sample=False
    )
    return result[0]["summary_text"].strip()

def generate_hashtags(text, category="News"):
    prompt = f"Generate 5 trending hashtags for this news:\n\"{text[:200]}\"\nInclude #{category}"
    result = tagger(
        prompt,
        max_new_tokens=40,
        do_sample=True,
        temperature=0.9
    )
    generated_text = result[0]["generated_text"].replace(prompt, "").strip()

    # Clean and ensure hashtags start with '#'
    hashtags = [tag.strip() for tag in generated_text.split() if tag.startswith("#")]
    if not any(f"#{category.lower()}" in tag.lower() for tag in hashtags):
        hashtags.append(f"#{category}")
    return hashtags
