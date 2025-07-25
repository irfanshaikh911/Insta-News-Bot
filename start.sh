#!/bin/bash

echo "🌐 Starting the Flask backend..."
cd backend
pip install -r requirements.txt
python app.py &

echo "🌐 Starting the React frontend..."
cd ../frontend
npm install
npm run build
npx serve -s build -l 3000
