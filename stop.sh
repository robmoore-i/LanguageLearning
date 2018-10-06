# Backend
echo "Stopping backend"
pkill -f "$QHOME/l32/q backend.q"

# Frontend
echo "Stopping frontend"
pkill -9 node
killall node

echo "Done"
exit 0

