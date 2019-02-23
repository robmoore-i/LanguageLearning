module QueryRunnerTest where

import QueryRunner
import RobUnit
    
main :: IO ()
main = do
    putStrLn "========= QueryRunner ========="
    ioTests <- pure $ shellQueryCommandBuilderTests ++ shellQueryCommandBuilderTests
    runIOTests ioTests
    putStrLn $ "ALL DONE (" ++ (show $ length ioTests) ++ " TESTS RAN)"

ioString :: String -> IO String
ioString = return :: String -> IO String

shellQueryCommandBuilderTests :: [IO String]
shellQueryCommandBuilderTests = [

    ioTest "Creates shell command for running a cypher query"
        (shellQueryCommandBuilder (ioString "user") (ioString "password") "MATCH (c:Course {name: \"Georgian\"}) RETURN c")
        "echo 'MATCH (c:Course {name: \"Georgian\"}) RETURN c;' | cypher-shell -u user -p password"

    ]

stubQueryCommandBuilder :: String -> IO String
stubQueryCommandBuilder query = return $ "building-command:" ++ query

mockQueryCommandRunner :: String -> IO String
mockQueryCommandRunner query = return $ "running-command:" ++ query

shellQueryRunnerTests :: [IO String]
shellQueryRunnerTests = [

    ioTest "Runs the shell command built by the command builder"
        (shellQueryRunner stubQueryCommandBuilder mockQueryCommandRunner "query")
        "running-command:building-command:query"

    ]