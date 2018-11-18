#!/bin/bash

# Note: This assumes that the production build is currently running on port $MELANGE_FRONTEND_PORT
# Usage: ./lighthouse-audit.sh <app-path>
# Example 1: ./lighthouse-audit.sh /
# Example 2: ./lighthouse-audit.sh /courses/Georgian/Colours

path=$1
filename=`echo "$path" | sed -e 's/\//_/g'`
lighthouse "http://localhost:${MELANGE_FRONTEND_PORT}${path}" --output-path=./lighthouse-audits/$filename.html
