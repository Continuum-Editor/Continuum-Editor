#!/bin/bash

# Clean up existing build if present
rm -r continuum-editor-osx-x64

# Download electron (Linux x64)
wget -nc https://github.com/atom/electron/releases/download/v0.34.1/electron-v0.34.1-darwin-x64.zip
unzip electron-v0.34.1-darwin-x64.zip -d continuum-editor-osx-x64

# Rename electron executable
mv continuum-editor-osx-x64/Electron.app continuum-editor-osx-x64/continuum-editor.app

# Make app directory
mkdir continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app/

# Sync *.html and *.js
rsync ../* continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app/ -r --exclude builds

# Install dependencies with npm install
cd continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app/
npm install
cd ../../../../../

# Remove extra files
rm continuum-editor-osx-x64/LICENSE
rm continuum-editor-osx-x64/version
