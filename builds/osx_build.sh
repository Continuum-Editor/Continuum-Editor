#!/bin/bash

# Download nw.js (OSX x64)
wget http://dl.nwjs.io/v0.12.2/nwjs-v0.12.2-osx-x64.zip
unzip nwjs-v0.12.2-osx-x64.zip
rm nwjs-v0.12.2-osx-x64.zip

# Rename nw.js directory
mv nwjs-v0.12.2-osx-x64 continuum-editor-osx-x64

# Rename nwjs.app bundle
mv continuum-editor-osx-x64/nwjs.app continuum-editor-osx-x64/continuum-editor.app

# Create app.nw directory
mkdir continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app.nw

# Sync *.html and *.js
rsync ../* continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app.nw/ -r --exclude builds

# Replace package.json with OS X version
mv continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app.nw/package_osx.json continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app.nw/package.json

# Remove left over nw.js
rm continuum-editor-osx-x64/credits.html
rm continuum-editor-osx-x64/nwjc

# Install dependencies with npm install
cd continuum-editor-osx-x64/continuum-editor.app/Contents/Resources/app.nw/
npm install
cd ../../../../../
