sudo ember build --environment=production
cd .. && sudo rm -rf public/assets && sudo rm public/index.html
sudo cp -R frontend/dist/* public/                           
