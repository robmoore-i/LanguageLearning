set -e
set -x

cat georgian/georgian.cql georgian/building_software/building_software.cql georgian/building_software/writing_code/writing_code.cql > create.cql

cypher-shell -u $APP_NEO4J_USER -p $APP_NEO4J_PW < create.cql

rm create.cql

set +e
set +x
