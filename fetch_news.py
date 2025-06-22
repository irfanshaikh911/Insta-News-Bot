import requests
import pandas as pd

def check_authorization(url,querystring, headers):
	response = requests.get(url, headers=headers, params=querystring)
	if response.status_code == 200:
		data = response.json()
		return data
	else:
		print(f"Error: {response.status_code}")
		return None


import pandas as pd

def get_all_tech_news(df):
    # df = pd.DataFrame(data['items'])[['title', 'snippet', 'images', 'subnews', 'hasSubnews', 'newsUrl', 'publisher']]
    df.rename(columns={
        'snippet': 'description',
        'newsUrl': 'url',
        'publisher': 'source'
    }, inplace=True)
    return df




