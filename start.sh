#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting build and deployment process ---"

# Create the src directory and move the frontend and backend directories into it
mkdir src
mv frontend backend src

# --- Frontend Build ---
echo "Navigating to frontend directory..."
cd src/frontend

echo "Installing frontend dependencies (npm install)..."
npm install

echo "Building frontend (npm run build)..."
npm run build

# --- Backend Dependencies ---
echo "Installing backend dependencies (pip install)..."
pip install -r ../backend/requirements.txt

echo "--- Build and deployment process complete ---"
