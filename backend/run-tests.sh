if [ "$1" == "r" ]
then
  ./assemble.sh
  cd test
  python3 test.py
  exitCode=$?
  cd ..
  exit $exitCode
elif [ "$1" == "a" ]
then
  python3 test.py
  exitCode=$?
  cd ..
  exit $exitCode
else
  echo "USAGE: $0 [r|a]"
  echo "a => don't rebuild before testing because it's (a)lready built."
  echo "r => (r)ebuild before testing."
  exit 1
fi
