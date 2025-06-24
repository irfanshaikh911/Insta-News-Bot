from authorization_api import check_authorization
from news_data import extract_data

import requests

url = "https://google-news13.p.rapidapi.com/technology"

querystring = {"lr":"en-US"}

headers = {
	"x-rapidapi-key": "1497ea47c9msh3b5d13c91060d0ep19119bjsn6fc82338c199",
	"x-rapidapi-host": "google-news13.p.rapidapi.com"
}

data = check_authorization(url, querystring, headers)
extracted_data = extract_data(data)
print(extracted_data)