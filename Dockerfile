# Use a multi-stage build to keep it light
FROM python:3.9-slim

WORKDIR /app

# Backend Setup
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .

# We assume frontend is built locally for this POC to keep Dockerfile simple
# Ideally, you'd use a Node stage to build React, but let's stick to KISS.

EXPOSE 5000

# Environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]