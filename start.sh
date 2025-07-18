#!/bin/bash
set -e

cd frontend
npm install
npm run build

cd ..
# cd ../backend
pip install -r backend/requirements.txt

exec python backend/app.py

