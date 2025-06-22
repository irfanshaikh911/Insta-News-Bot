import streamlit as st
import os
import ast
import time
import pandas as pd
from fetch_news import check_authorization, get_all_tech_news
from summarize import summarize_text
from get_hashtags import get_trending_tech_hashtags
from insta_bot import InstaBotWrapper
from image_extractor import extract_thumbnail  # downloads image

st.set_page_config(page_title="📰 Tech News InstaBot", layout="centered")
st.title("📰 Tech News InstaBot")

# --- API Setup ---
url = "https://google-news13.p.rapidapi.com/business"
querystring = {"lr": "en-US"}
headers = {
    "x-rapidapi-key": "1497ea47c9msh3b5d13c91060d0ep19119bjsn6fc82338c199",
    "x-rapidapi-host": "google-news13.p.rapidapi.com"
}

# --- Load & cache data ---
if "news_df" not in st.session_state:
    # data = check_authorization(url, querystring, headers)
    data = pd.read_csv('data/google_news_technology.csv')  # local fallback
    st.session_state.news_df = get_all_tech_news(data)

news_df = st.session_state.news_df

# --- Cache headlines in session state ---
if "headlines" not in st.session_state:
    st.session_state.headlines = news_df['title'].tolist()

if st.button("🔍 Fetch Today's Tech Headlines"):
    st.session_state.headlines = news_df['title'].tolist()

headlines = st.session_state.headlines

# --- Headline selection ---
if headlines:
    selected = st.selectbox(
        "📰 Select a headline to post:",
        headlines,
        index=headlines.index(st.session_state.get("selected_headline", headlines[0]))
    )
    st.session_state.selected_headline = selected

    selected_row = news_df[news_df['title'] == selected].iloc[0]
    description = selected_row['description']
    news_url = selected_row['url']
    publisher = selected_row['source']
    image_str = selected_row['images']

    # --- Download image from thumbnail ---
    extract_thumbnail(image_str)

    # --- Show article summary & meta ---
    col1, col2 = st.columns([2, 1])
    with col1:
        st.markdown(f"**📝 Summary:** {summarize_text(description)}")
        st.markdown(f"**🔗 Read More:** [Click here]({news_url})")
    with col2:
        st.markdown("**🏢 Publisher:**")
        st.code(publisher or "Unknown")

    hashtags = get_trending_tech_hashtags()
    st.markdown("**📌 Hashtags:**")
    st.code(hashtags)

    # --- Preview image ---
    st.markdown("### 🖼️ Instagram Post Preview")
    if os.path.exists("news_card.png"):
        st.image("news_card.png", caption="📸 Insta Post Preview", use_container_width=True)
    else:
        st.warning("⚠️ Image not found. Please check if thumbnail exists.")

    # --- Instagram credentials & upload ---
    st.markdown("### 📤 Upload to Instagram")
    username = st.text_input("Instagram Username")
    password = st.text_input("Instagram Password", type="password")

    if st.button("📲 Post Now"):
        if not username or not password:
            st.warning("Please enter Instagram credentials.")
        elif not os.path.exists("news_card.png"):
            st.error("🖼️ `news_card.png` not found. Please generate it before posting.")
        else:
            bot = InstaBotWrapper()
            if bot.login(username, password):
                caption = f"{selected}\n\nRead more: {news_url}\n\n{hashtags}"
                if bot.upload_image("news_card.png", caption):
                    st.success("✅ Posted to Instagram!")
                else:
                    st.error("❌ Upload failed.")
                bot.logout()
            else:
                st.error("❌ Login failed.")
else:
    st.warning("No headlines found. Please fetch the latest news.")
