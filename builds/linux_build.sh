#!/bin/bash

# Clean up existing build if present
rm -r continuum-editor-linux-x64

# Download electron (Linux x64)
wget -nc https://github.com/atom/electron/releases/download/v0.30.2/electron-v0.30.2-linux-x64.zip
unzip electron-v0.30.2-linux-x64.zip -d continuum-editor-linux-x64

# Rename electron executable
mv continuum-editor-linux-x64/electron continuum-editor-linux-x64/continuum-editor

# Make app directory
mkdir continuum-editor-linux-x64/resources/app

# Sync *.html and *.js
rsync ../* continuum-editor-linux-x64/resources/app/ -r --exclude builds

# Install dependencies with npm install
cd continuum-editor-linux-x64/resources/app/
npm install
cd ../../../
