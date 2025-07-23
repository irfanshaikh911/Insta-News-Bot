# ------------------- Frontend Stage -------------------
FROM node:18-slim AS frontend

# Set working directory
WORKDIR /app/frontend

# Install dependencies & build only
COPY frontend/package*.json ./
# RUN npm ci --omit=dev
RUN npm ci

# Copy all source and build
COPY frontend/ .
RUN npm run build

# Remove node_modules to save space
RUN rm -rf node_modules


# ------------------- Backend Stage -------------------
FROM python:3.11-slim AS backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app/backend

# Install Python deps first
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend /app/frontend/dist ./static

# Expose port (if needed by platform)
EXPOSE 5000

# Launch the app
CMD ["bash", "/app/backend/start.sh"]
