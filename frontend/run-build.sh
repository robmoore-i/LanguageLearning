#!/bin/bash

# Example: ./run-build.sh r

if [ "$1" == "r" ]
then
    yarn build
    $(yarn global bin)/serve -s -l $MELANGE_FRONTEND_PORT build/
    exit $?
elif [ "$1" == "a" ]
then
    $(yarn global bin)/serve -s -l $MELANGE_FRONTEND_PORT build/
    exit $?
else
    echo "USAGE: $0 r|a"
    echo "a => don't rebuild for production because it's (a)lready built."
    echo "r => (r)ebuild for production before running"
    exit 1
fi
