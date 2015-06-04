#!/bin/bash

# Download nw.js (Windows x64)
wget -nc http://dl.nwjs.io/v0.12.2/nwjs-v0.12.2-win-x64.zip
unzip nwjs-v0.12.2-win-x64.zip

# Rename nw.js directory
mv nwjs-v0.12.2-win-x64 continuum-editor-windows-x64

# Rename nw.js executable
mv continuum-editor-windows-x64/nw.exe continuum-editor-windows-x64/continuum-editor.exe

# Sync *.html and *.js
rsync ../* continuum-editor-windows-x64/ -r --exclude builds

# Install dependencies with npm install
cd continuum-editor-windows-x64
npm install
cd ..
