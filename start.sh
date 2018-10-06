# Backend
echo "Starting backend"
cd backend/
$QHOME/l32/q backend.q &

# Frontend
echo "Starting frontend"
cd ../frontend
npm start &
cd ..

echo "Done"
exit 0
