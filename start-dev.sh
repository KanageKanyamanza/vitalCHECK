#!/bin/bash

echo "Starting UBB Health Check Development Environment..."

echo ""
echo "Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!

echo ""
echo "Starting Frontend Client..."
cd ../client
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
