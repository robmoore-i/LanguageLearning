#!/bin/bash

# Example 1: ./lighthouse-audit.sh / r
# Example 2: ./lighthouse-audit.sh /courses/Georgian/Colours a

if [ "$2" == "r" ]
then
    path=$1
    filename=`echo "$path" | sed -e 's/\//_/g'`
    ./run-build.sh a &
    lighthouse "http://localhost:${MELANGE_FRONTEND_PORT}${path}" --output-path=./lighthouse-audits/$filename.html
    pkill -f "node $(yarn global bin)/serve -s -l 3000 build/"
    exit 1
elif [ "$2" == "a" ]
then
    path=$1
    filename=`echo "$path" | sed -e 's/\//_/g'`
    lighthouse "http://localhost:${MELANGE_FRONTEND_PORT}${path}" --output-path=./lighthouse-audits/$filename.html
    exit 0
else
    echo "USAGE: $0 <app-path> r|a"
    echo "a => don't run production frontend before audit because it's (a)lready running."
    echo "r => (r)un production frontend before audit."
    exit 1
fi
