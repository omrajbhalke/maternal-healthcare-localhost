FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend
COPY frontend/ ./frontend
COPY tests/ ./tests

EXPOSE 5000

ENV FLASK_APP=backend/app.py
ENV FLASK_RUN_PORT=5000
ENV FLASK_ENV=production

CMD ["python", "backend/app.py"]
