#!/bin/bash

if [[ -z $QHOME || -z $QARCH ]]
then
    echo "You need to set the QHOME and QARCH environment variables."
    echo "For example, QHOME=/home/q and QARCH=l32 are potential values."
    echo "QHOME/QARCH/q should be the executable q file."
    exit 1
fi

if [[ `uname` == "Darwin" ]]
then
    cwd=`python -c "import os; print(os.path.realpath('$0'))" | xargs dirname`
else
    cwd=`realpath $0 | xargs dirname`
fi

cd $cwd/src
rlwrap $QHOME/$QARCH/q start.q
