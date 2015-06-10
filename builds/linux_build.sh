#!/bin/bash

# Clean up existing build if present
rm -r continuum-editor-linux-x64
rm -r nwjs-v0.12.2-linux-x64

# Download nw.js (Linux x64)
wget -nc http://dl.nwjs.io/v0.12.2/nwjs-v0.12.2-linux-x64.tar.gz
tar -xvf nwjs-v0.12.2-linux-x64.tar.gz

# Rename nw.js directory
mv nwjs-v0.12.2-linux-x64 continuum-editor-linux-x64

# Rename nw.js executable
mv continuum-editor-linux-x64/nw continuum-editor-linux-x64/continuum-editor

# Sync *.html and *.js
rsync ../* continuum-editor-linux-x64/ -r --exclude builds

# Install dependencies with npm install
cd continuum-editor-linux-x64
npm install
cd ..
