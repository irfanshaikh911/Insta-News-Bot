# #!/bin/bash

# # Exit immediately if a command exits with a non-zero status.
# set -e

# echo "--- Starting build and deployment process ---"

# # Create the src directory and move the frontend and backend directories into it
# mkdir src
# mv frontend backend src

# # --- Frontend Build ---
# echo "Navigating to frontend directory..."
# cd src/frontend

# echo "Installing frontend dependencies (npm install)..."
# npm install

# echo "Building frontend (npm run build)..."
# npm run build

# # --- Backend Dependencies ---
# echo "Installing backend dependencies (pip install)..."
# pip install -r ../backend/requirements.txt

# echo "--- Build and deployment process complete ---"
#!/usr/bin/env bash

# Step 1: Build the frontend
cd frontend
npm install
npm run build

# Step 2: Move the build to backend/static
rm -rf ../backend/static
mkdir -p ../backend/static
cp -r dist/* ../backend/static/

# Step 3: Start the backend Flask app
cd ../backend
pip install -r requirements.txt
# gunicorn app:app --bind=0.0.0.0:$PORT
