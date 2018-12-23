set -e
set -x

cat delete_existing.cql georgian.cql german.cql french.cql > create.cql

cypher-shell -u $MELANGE_NEO4J_USER -p $MELANGE_NEO4J_PW < create.cql

rm create.cql

set +e
set +x
