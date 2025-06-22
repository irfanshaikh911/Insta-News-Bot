import requests

def check_authorization(url,querystring, headers):
	response = requests.get(url, headers=headers, params=querystring)
	if response.status_code == 200:
		data = response.json()
		return data
	else:
		print(f"Error: {response.status_code}")
		return None