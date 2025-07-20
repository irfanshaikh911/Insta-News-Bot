#!/bin/bash

# Exit on any error
set -e

echo "🔧 Installing frontend dependencies..."
cd frontend
npm install

echo "⚙️ Building frontend..."
npm run build

echo "🚀 Launching backend..."
cd ../backend

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🌐 Starting the application..."
python app.py

