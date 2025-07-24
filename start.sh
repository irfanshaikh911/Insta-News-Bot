#!/bin/bash
set -e

echo "🚀 Launching backend..."

cd backend

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🌐 Starting the application..."
exec gunicorn -b 0.0.0.0:5000 app:app
