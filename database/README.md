# Database files

The directory contains files related specifically to the serving of static content within the app.

- The `courses/` directory contains the cypher scripts which build the database
- The `extracts/` directory contains organised text files which have the extracts used for reading questions
- The `images/` directory contains images which are served by the server

# Database setup

1. Install Neo4j Community Edition

2. Run Neo4J: `neo4j console` - this is inside the `start-neo4j.sh` script.

3. Make sure your environment is configured. See the root README and config/ directory.
You specifically will need the environment variables `APP_NEO4J_USER` and
`APP_NEO4J_PW` to be set.

4. Populate the database: `reset-db.sh`
