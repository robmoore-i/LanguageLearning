module ConsistencyCheckerTest where

import ConsistencyChecker
import RobUnit
    
main :: IO ()
main = do
    putStrLn "========= ConsistencyChecker ========="
    runPureTests tests
    putStrLn "ALL DONE"

tests :: [String]
tests = [

    makeTest "Creates shell commands correctly"
        1
        1

    ]
