module RobUnit where

import Control.Monad
import Control.Conditional
import Data.String.Utils

runPureTests :: [String] -> IO ()
runPureTests = (putStr . concat . appendFailedCount)

runIOTests :: [IO String] -> IO ()
runIOTests = (foldr (>>) (return ())) . (map ioResult)

makeTest :: (Eq a, Show a) => String -> a -> a -> String
makeTest description actual expected =
  if expected == actual
  then ""
  else "FAIL: " ++ description ++ "\n\texp: " ++ show expected ++ "\n\tact: " ++ show actual ++ "\n"

appendFailedCount :: [String] -> [String]
appendFailedCount tests = tests ++ ["PASSED: " ++ show passed ++ " FAILED: " ++ show fails ++ "\n"]
  where
    fails  = length (filter (startswith "FAIL") tests)
    passed = length tests - fails

ioTest :: (Show a, Eq a) => String -> IO a -> a -> IO String
ioTest description actual expected =
  ifM (liftM (== expected) actual) (return "") (ioFailureMessage description actual (show expected))
  
ioFailureMessage :: (Show a) => String -> IO a -> String -> IO String
ioFailureMessage description actual expected
  = liftM (\x -> concat ["FAIL: ", description, "\n\texp: ", expected, "\n\tact: ", show x, "\n"]) actual

ioResult :: IO String -> IO ()
ioResult test = do
  result <- test
  putStr result
