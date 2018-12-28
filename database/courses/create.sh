set -e
set -x

cat delete_existing.cql georgian.cql german.cql french.cql > create.cql

cypher-shell -u $APP_NEO4J_USER -p $APP_NEO4J_PW < create.cql

rm create.cql

set +e
set +x
