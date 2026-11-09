#!/bin/bash
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 4200/tcp 2>/dev/null || true
sleep 1

cd /home/drgp82/test-claude-project/website_CT/backend
npm run dev > /tmp/be_ct.log 2>&1 &

cd /home/drgp82/test-claude-project/website_CT/frontend
npm start -- --host 0.0.0.0 > /tmp/fe_ct.log 2>&1 &

echo "Aguardando compilacao (25s)..."
sleep 25

echo "=== Health ==="
curl -s http://localhost:3000/health

echo ""
echo "=== Frontend ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:4200/

echo "READY"
