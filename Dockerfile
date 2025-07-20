# --------- Stage 1: Build Frontend (React/Vite/Next.js) ----------
FROM node:18-alpine as frontend

WORKDIR /app/frontend
COPY frontend/ ./
RUN npm install
RUN npm run build

# --------- Stage 2: Main Python App ----------
FROM python:3.10-slim

# Install OS dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ /app/backend
COPY requirements.txt /app/backend/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r /app/backend/requirements.txt

# Copy frontend build output
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Copy start.sh and make it executable
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set environment variables (optional)
ENV PYTHONUNBUFFERED=1

# Expose default port (used by Flask)
EXPOSE 5000

# Start app
CMD ["./start.sh"]
