#!/bin/bash

# echo "🌐 Starting the Flask backend..."
# cd backend
# pip install -r requirements.txt
# python app.py &
echo "🚀 Starting the Flask backend with Gunicorn..."
cd backend
gunicorn app:app --bind 0.0.0.0:5000 --workers 4 --threads 2 --timeout 120

echo "🌐 Starting the React frontend..."
cd ../frontend
npx serve -s build -l 3000
