import streamlit as st
import os
import pandas as pd
from fetch_news import get_all_tech_news
from summarize import summarize_text
from get_hashtags import get_trending_tech_hashtags
from image_extractor import extract_thumbnail

# Setup only once
st.set_page_config(page_title="🤖 InstaBot", layout="centered")
st.title("🤖 Tech News to Instagram Poster")

# Tabs
tab1, tab2 = st.tabs(["📰 Auto News Selector", "📤 Post to Instagram"])

# --- Session keys for sharing across tabs ---
if "auto_caption" not in st.session_state:
    st.session_state.auto_caption = ""
if "image_ready" not in st.session_state:
    st.session_state.image_ready = False

# -----------------------
# TAB 1: Auto News Post
# -----------------------
with tab1:
    st.subheader("Select Tech News to Generate Insta Post")

    data = pd.read_csv("data/google_news_technology.csv")
    news_df = get_all_tech_news(data)

    if "headlines" not in st.session_state:
        st.session_state.headlines = news_df['title'].tolist()

    if st.button("🔍 Refresh News"):
        st.session_state.headlines = news_df['title'].tolist()

    headlines = st.session_state.headlines

    if headlines:
        selected = st.selectbox(
            "📰 Choose headline to post:",
            headlines,
            index=headlines.index(st.session_state.get("selected_headline", headlines[0]))
        )
        st.session_state.selected_headline = selected

        selected_row = news_df[news_df['title'] == selected].iloc[0]
        description = selected_row['description']
        news_url = selected_row['url']
        publisher = selected_row['source']
        image_str = selected_row['images']

        # Extract & download thumbnail
        extract_thumbnail(image_str)
        st.session_state.image_ready = os.path.exists("news_card.png")

        # Generate caption with hashtags
        hashtags = get_trending_tech_hashtags()
        summary = summarize_text(description)
        full_caption = f"{selected}\n\n{summary}\n\nRead more: {news_url}\n\n{hashtags}"
        st.session_state.auto_caption = full_caption

        # Show preview
        col1, col2 = st.columns([2, 1])
        with col1:
            st.markdown(f"**📝 Summary:** {summary}")
            st.markdown(f"**🔗 Read More:** [Click here]({news_url})")
        with col2:
            st.markdown("**🏢 Publisher:**")
            st.code(publisher or "Unknown")

        st.markdown("**📌 Hashtags Used:**")
        st.code(hashtags)

        if st.session_state.image_ready:
            st.image("news_card.png", caption="🖼️ Insta Image", use_container_width=True)
        else:
            st.warning("⚠️ Image not found. Try again.")

# -----------------------
# TAB 2: Post to Instagram
# -----------------------
with tab2:
    st.subheader("📤 Upload Auto-Filled Insta Post")

    with st.form("insta_form"):
        username = st.text_input("Instagram Username")
        password = st.text_input("Instagram Password", type="password")
        caption = st.text_area("Auto-Filled Caption", value=st.session_state.auto_caption, height=200)
        st.markdown("**🖼️ Selected Image Preview:**")
        if st.session_state.image_ready:
            st.image("news_card.png", caption="🖼️ Ready to Post", use_container_width=True)
        else:
            st.warning("No image found. Please choose a headline first.")
        submitted = st.form_submit_button("📲 Post Now")

    if submitted:
        if not username or not password:
            st.warning("Please enter your Instagram credentials.")
        elif not st.session_state.image_ready:
            st.error("❌ Image not found. Please select a headline first.")
        else:
            # Save login + caption to file
            with open("insta_config.txt", "w", encoding="utf-8") as f:
                f.write(f"{username}\n{password}\n{caption}")

            # # Rename image for Instabot
            if os.path.exists("news_card.png"):
                if not os.path.exists("news_card.png.REMOVE_ME"):
                    os.rename("news_card.png", "news_card.png.REMOVE_ME")

            # Run upload script
            result = os.system("python Insta_Api.py")
            if result == 0:
                st.success("✅ Posted successfully!")
            else:
                st.error("❌ Failed to post. Check credentials or image format.")
