#!/bin/bash
set -e

cd frontend
npm install
npm run build

cd ../backend
pip install -r requirements.txt

exec python backend/app.py

