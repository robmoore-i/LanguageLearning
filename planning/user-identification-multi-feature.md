# Next multi-feature: User identification

## Pre-requisites

- Cookie manipulation is understood and managed

## Motivation

As a learner I want my learnings to be stored across sessions so that I can be reminded of
lessons I need to practice periodically to stay sharp.

## Solution

- Simplest solution:  Store everything in the browser.

- Better solution: Store a cookie identifying users in the browser and store all the actual data
in the server.

& that's good enough.

## Data stored

- Lessons completed along with their last completion times and all the lesson stats acrued from
their completions.

## Implementation

Upon completing a lesson, the following, connected information is stored in the database via
the server:

- Which lesson I just completed
- The time at which I completed it
- The time it took me to complete it
- My accuracy in this lesson

### Frontend

New visual: Show number of learner completions in the header bar

New cache interaction: New learner
Create a learner unique id and store it locally.

New cache and server interaction: Save completion data
Upon completing a lesson, send completion data back to the server with the learner's unique id

### Server

New Endpoint: GET /numberofcompletions/:learnerUniqueId

Behaviour:

- Returns the number of lesson completions by a given learner
- If the specified learner doesn't exist in the database yet, return 0

New Endpoint: POST /completed/:coursename/:lessonname
POST body: {learnerUniqueId, timestamp, timeTakenSeconds, lessonAccuracy}

Behaviour:

- Stores the completion in the database
- If the specified learner doesn't exist in the database yet, create them first

### Database

New Node: Learner

`Learner { uniqueId }`

New Relationship: COMPLETED

`COMPLETED { completionTime, timeTakenSeconds, lessonAccuracy }`

When a lesson is completed, the database recieves a query like this:

```
MERGE (learner:Learner {uniqueId: "rob-who-learns-stuff"})
MATCH (course:Course {name: "Georgian:})-[:HAS_TOPIC_LESSON]->(lesson:TopicLesson {name: "Hello"})
CREATE (learner)-[:COMPLETED {timestamp: datetime('2019-02-16T12:42:50.123+00:00'), timeTakenSeconds: 184, lessonAccuracy: 90.5}]->(lessson)
```

