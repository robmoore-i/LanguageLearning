module QueryRunner where

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

shellQueryCommandBuilder :: IO String -> IO String -> String -> IO String
shellQueryCommandBuilder neo4jUser neo4jPw query = 
    concatUnder [pure "echo '", pure query, pure ";' | cypher-shell -u ", neo4jUser, pure " -p ", neo4jPw]

shellCommandRunner :: String -> IO String
shellCommandRunner cmd = readCreateProcess (shell cmd) ""

-- Given a method for running commands on the command line
-- And a method for building query commands to run on the command line
-- And a cypher query string (with any double quotes being escaped)
-- Returns an string containing the stdout results
shellQueryRunner :: (String -> IO String) -> (String -> IO String) -> String -> IO String
shellQueryRunner queryCommandBuiler commandRunner query = do
    cmd <- queryCommandBuiler query
    commandRunner cmd

defaultShellQueryRunner :: String -> IO String
defaultShellQueryRunner = shellQueryRunner (shellQueryCommandBuilder neo4jUser neo4jPw) shellCommandRunner