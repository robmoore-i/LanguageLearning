# Backend
echo "Starting backend"
cd backend/
$QHOME/l32/q backend.q > ../backend.log &

# Frontend
echo "Starting frontend"
cd ../frontend
npm start > ../frontend.log &
cd ..

echo "Done"
exit 0
