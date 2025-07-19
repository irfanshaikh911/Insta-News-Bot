#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting build and deployment process ---"

# --- Frontend Build ---
echo "Navigating to frontend directory..."
cd frontend

echo "Installing frontend dependencies (npm install)..."
npm install

echo "Building frontend (npm run build)..."
npm run build

echo "Returning to project root directory..."
cd ..

echo "--- Build and deployment process complete ---"
