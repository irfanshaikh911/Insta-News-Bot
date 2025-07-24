# ------------------- Frontend Stage -------------------
FROM node:18-slim AS frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

RUN rm -rf node_modules


# ------------------- Backend Stage -------------------
FROM python:3.11-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Set root workdir
WORKDIR /app

# Install backend Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code
COPY backend/ ./backend

# Copy built frontend files
RUN mkdir -p backend/static
COPY --from=frontend /app/frontend/dist/ ./backend/static

# Copy start.sh to root
COPY start.sh .

# Expose port if needed
EXPOSE 5000

# Start the app
CMD ["bash", "start.sh"]
