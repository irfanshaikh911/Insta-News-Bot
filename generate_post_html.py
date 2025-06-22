from html2image import Html2Image

def create_html_post(headline):
    html = f"""
    <html>
    <body style="width:1080px; height:1080px; background: linear-gradient(to right, #0f2027, #203a43, #2c5364); display: flex; align-items: center; justify-content: center;">
      <h1 style="color: white; font-size: 48px; font-family: sans-serif; padding: 50px;">{headline}</h1>
    </body>
    </html>
    """
    hti = Html2Image()
    hti.screenshot(html_str=html, save_as='news_card.png', size=(1080, 1080))
    