import requests

url = "https://google-news13.p.rapidapi.com/business"

querystring = {"lr":"en-US"}

headers = {
	"x-rapidapi-key": "81c76983d3mshee9f309a9cab055p10d804jsn85289f401656",
	"x-rapidapi-host": "google-news13.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())