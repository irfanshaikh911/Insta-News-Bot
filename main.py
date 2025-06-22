import streamlit as st
from fetch_news import check_authorization, get_all_tech_news
from summarize import summarize_text
from get_hashtags import get_trending_tech_hashtags
from generate_post_html import create_html_post
from insta_bot import InstaBotWrapper

st.set_page_config(page_title="📰 Tech News InstaBot", layout="centered")
st.title("📰 Tech News InstaBot")

url = "https://google-news13.p.rapidapi.com/business"

querystring = {"lr":"en-US"}

headers = {
	"x-rapidapi-key": "1497ea47c9msh3b5d13c91060d0ep19119bjsn6fc82338c199",
	"x-rapidapi-host": "google-news13.p.rapidapi.com"
}

if "news_df" not in st.session_state:
    data = check_authorization(url, querystring, headers)
    st.session_state.news_df = get_all_tech_news(data)

news_df = st.session_state.news_df

if st.button("🔍 Fetch Today's Tech Headlines"):
    headlines = news_df['title'].tolist()
    st.session_state.headlines = headlines

    if headlines:
        selected = st.selectbox("📰 Select a headline to post:", headlines)
        selected_row = news_df[news_df['title'] == selected].iloc[0]
        description = selected_row['description']
        url = selected_row['url']
        publisher = selected_row['source']
        image_links = selected_row.get('images', [])
        image_url = image_links[0] if image_links else None

        st.image(image_url, caption="🖼️ News Image", use_column_width=True)
        col1, col2 = st.columns([2, 1])
        with col1:
            st.markdown(f"**📝 Summary:** {summarize_text(description)}")
            st.markdown(f"**🔗 Read More:** [Click here]({url})")
        with col2:
            st.markdown("**🏢 Publisher:**")
            st.code(publisher or "Unknown")

        hashtags = get_trending_tech_hashtags()
        st.markdown("**📌 Hashtags:**")
        st.code(hashtags)

        create_html_post(selected, image_url=image_url, logo_path="assets/logo.png")
        st.image("news_card.png", caption="📸 Insta Post Preview", use_column_width=True)

        username = st.text_input("Instagram Username")
        password = st.text_input("Instagram Password", type="password")

        if st.button("📤 Upload to Instagram"):
            if username and password:
                bot = InstaBotWrapper()
                if bot.login(username, password):
                    caption = f"{selected}\n\nRead more: {url}\n\n{hashtags}"
                    bot.upload_image("news_card.png", caption)
                    bot.logout()
                    st.success("✅ Posted to Instagram!")
                else:
                    st.error("❌ Login failed.")
            else:
                st.warning("Please enter your credentials.")
