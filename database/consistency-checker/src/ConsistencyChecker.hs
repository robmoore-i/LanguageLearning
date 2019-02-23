module ConsistencyChecker where

import System.Environment
import Control.Monad
import System.Process

neo4jUser :: IO String
neo4jUser = getEnv "APP_NEO4J_USER"

neo4jPw :: IO String
neo4jPw = getEnv "APP_NEO4J_PW"

exampleQuery :: String
exampleQuery = "MATCH (c:Course {name: \"Georgian\"})-[r:HAS_TOPIC_LESSON]-(tl) RETURN r.index"

-- Given a traversable collection of actions returning a list
-- Converts it to a single action returning a single list
concatUnder :: (Monad m, Traversable t) => t (m [a]) -> m [a]
concatUnder = liftM concat . sequence

-- Given a cypher query (with any double quotes being escaped)
-- Returns a string containing the stdout results
ioRunQuery :: String -> IO String
ioRunQuery query = do
    cmd <- concatUnder [pure "echo '", pure query, pure ";' | cypher-shell -u ", neo4jUser, pure " -p ", neo4jPw]
    readCreateProcess (shell cmd) ""