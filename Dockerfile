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

# ✅ Set root project directory as workdir
WORKDIR /app

# ✅ Copy everything from project root
COPY . .

# ✅ Install Python dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# ✅ Copy built frontend from previous stage to backend/static
RUN mkdir -p backend/static 
COPY --from=frontend /app/frontend/dist/ ./backend/static

# ✅ Make sure start.sh is executable
RUN chmod +x start.sh

EXPOSE 5000

# ✅ Start the app using script in root
CMD ["bash", "start.sh"]
