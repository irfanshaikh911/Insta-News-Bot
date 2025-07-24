# ------------------- Frontend Stage -------------------
FROM node:18-slim AS frontend

WORKDIR /app

# Install only production dependencies
COPY frontend/package*.json ./
RUN npm ci --omit=dev

# Copy source and build
COPY frontend/ .
RUN npm run build


# ------------------- Backend Stage -------------------
FROM python:3.11-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend assets
COPY --from=frontend /app/dist ./static

# Copy start.sh (from root)
COPY start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 5000

CMD ["bash", "start.sh"]
