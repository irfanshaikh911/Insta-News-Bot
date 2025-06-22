from news_data import extract_data
import pandas as pd

df = pd.read_csv(r'C:\Users\Shaikh Irfan\Documents\Ai Adeventures\Insta Bot\data\google_news_technology.csv')

for i in df['title']:
    print(i)
user = int(input('Enter perfered title'))

