#!/bin/bash

if [ -d "cmg/node_modules" ]; then
    echo "Node modules found in the cmg directory."
else
    echo "Node modules not found in the cmg directory. Running 'npm i'..."
    cd cmg
    npm i
    cd ..
fi

cd cmg
npm run start:all 