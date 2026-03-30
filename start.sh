#!/bin/bash

# Start Python Gemini service in background
echo "Starting Gemini AI Service..."
python3 scripts/gemini_service.py 3001 &
PYTHON_PID=$!

# Wait for Python service to start
sleep 2

# Start the frontend dev server
echo "Starting frontend development server..."
npm run dev

# Cleanup on exit
trap "kill $PYTHON_PID" EXIT
