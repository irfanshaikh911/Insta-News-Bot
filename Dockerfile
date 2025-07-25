# ------------------- Frontend Stage -------------------
FROM node:18-slim AS frontend

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ------------------- Backend Stage -------------------
FROM python:3.11-slim AS backend

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install serve globally for serving frontend
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g serve

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend

# Copy frontend build to backend/static
RUN mkdir -p backend/static
COPY --from=frontend /app/frontend/dist ./backend/static

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Expose ports (5000 for backend, 3000 if you ever serve separately)
EXPOSE 5000

# Start both servers
CMD ["bash", "start.sh"]
