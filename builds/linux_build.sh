#!/bin/bash

# Download nw.js (Linux x64)
wget http://dl.nwjs.io/v0.12.1/nwjs-v0.12.1-linux-x64.tar.gz
tar -xvf nwjs-v0.12.1-linux-x64.tar.gz
rm nwjs-v0.12.1-linux-x64.tar.gz

# Rename nw.js directory
mv nwjs-v0.12.1-linux-x64 continuum-editor-linux-x64

# Rename nw.js executable
mv continuum-editor-linux-x64/nw continuum-editor-linux-x64/continuum-editor

# Sync *.html and *.js
rsync ../* continuum-editor-linux-x64/ -r --exclude ../build
