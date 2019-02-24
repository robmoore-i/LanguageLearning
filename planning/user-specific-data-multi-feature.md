# Multi-feature: User-specific data

## Pre-requisites

- Client storage manipulation is well understood. See Analytics and SessionIdProvider objects.

## Motivation

As a learner I want my progress and history of use to be saved and used to improve my learning.

## Solution

- Simplest solution:  Store everything in the browser. If the user wipes their cache, then it all goes

## Data stored

- Lessons completed along with their last completion times and all the lesson stats acrued from their completions.

## Implementation

Upon completing a lesson, the following information is stored.

- Which lesson I just completed
- The time at which I completed it
- The time it took me to complete it
- My accuracy in this lesson

## Frontend

Upon completing a lesson, store the time of completion, the name of the lesson, the time taken for completion and the lesson accuracy

Show number of locally stored learner completions in the header bar
