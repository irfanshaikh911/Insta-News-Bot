# === STAGE 1: Build React frontend ===
FROM node:18 AS frontend

WORKDIR /app
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# === STAGE 2: Backend with frontend static files ===
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build from previous stage
COPY --from=frontend /app/frontend/build ./frontend/build

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE 5000

# Start the Flask app
CMD ["gunicorn", "backend.app:app", "-b", "0.0.0.0:5000"]
