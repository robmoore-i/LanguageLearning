#!/bin/bash

if [[ -z $QHOME || -z $QARCH ]]
then
    echo "You need to set the QHOME and QARCH environment variables."
    echo "For example, QHOME=/home/q and QARCH=l32 are potential values."
    echo "QHOME/QARCH/q should be the executable q file."
    exit 1
fi

cwd=`realpath $0 | xargs dirname`

cd $cwd/src
$QHOME/$QARCH/q start.q &
cd ..
