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

    makeTest "1 = 1"
        1
        1

    ]
