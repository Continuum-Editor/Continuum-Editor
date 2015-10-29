#!/bin/bash

# Clean up existing build if present
rm -r continuum-editor-windows-x64

# Download electron (Linux x64)
wget -nc https://github.com/atom/electron/releases/download/v0.34.1/electron-v0.34.1-win32-x64.zip
unzip electron-v0.34.1-win32-x64.zip -d continuum-editor-windows-x64

# Rename electron executable
mv continuum-editor-windows-x64/electron.exe continuum-editor-windows-x64/continuum-editor.exe

# Make app directory
mkdir continuum-editor-windows-x64/resources/app

# Sync *.html and *.js
rsync ../* continuum-editor-windows-x64/resources/app/ -r --exclude builds

# Install dependencies with npm install
cd continuum-editor-windows-x64/resources/app/
npm install
cd ../../../
