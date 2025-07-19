#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting build and deployment process ---"

# --- Frontend Build ---
echo "Navigating to frontend directory..."
cd frontend

echo "Installing frontend dependencies (npm install)..."
# Using --force or --legacy-peer-deps might be needed for some React setups
# npm install --force
npm install

echo "Building frontend (npm run build)..."
npm run build

# Verify frontend build output (optional, but good for debugging)
if [ -d "build" ]; then
  echo "Frontend build directory 'frontend/build' created successfully."
else
  echo "ERROR: Frontend build directory 'frontend/build' not found after build!"
  echo "Please check your 'frontend/package.json' build script and its output."
  exit 1 # Exit if build output is missing
fi

echo "Returning to project root directory..."
cd .. # Go back to the project root: /opt/render/project/

# --- Backend Dependencies ---
echo "Installing backend dependencies (pip install)..."
# Assuming requirements.txt is at backend/requirements.txt relative to project root
pip install -r backend/requirements.txt

# --- Start Backend Application ---
echo "Starting backend application (python backend/app.py)..."
# 'exec' replaces the current shell process with the Python app process.
# This is generally good practice for the final command in a startup script
# as it ensures signals (like SIGTERM from Render) are passed directly to your app.
exec python backend/app.py

echo "--- Build and deployment process complete (this line should not be reached if exec works) ---"