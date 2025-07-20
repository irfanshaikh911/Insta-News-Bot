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
gunicorn app:app --bind 0.0.0.0:$PORT
