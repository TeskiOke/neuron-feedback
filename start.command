#!/bin/bash
cd "$(dirname "$0")"
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
echo "=================================================="
echo "  Запуск проекта Нейрон"
echo "  На компьютере: http://localhost:5173"
echo "  С телефона (тот же Wi-Fi): http://$IP:5173"
echo "=================================================="
npm run dev
