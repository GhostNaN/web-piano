#!/bin/sh

# Create venv and get missing python dependencies 
python -m venv venv --system-site-packages
source venv/bin/activate
pip install -r venv/requirements.txt

# Make files executable
chmod +x web.py

# Install javascript dependencies and build
cd scripts
npm install
npm run build
    
echo ""
echo "Done"
