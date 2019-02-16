# Next multi-feature: User identification

## Motivation

As a learner I want my learnings to be stored across sessions so that I can be reminded of
lessons I need to practice periodically to stay sharp.

## Solution

- Simplest solution:  Store everything in the browser.

- Better solution: Store a cookie identifying users in the browser and store all the actual data
in the server.

- Better solution: User picks the value of their cookie (a username, if you will) which references
all the actual data stored in the server.

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

### Database

New Node: Learner

`Learner { cookie }`

New Relationship: COMPLETED

`COMPLETED { completionTime, timeTakenSeconds, lessonAccuracy }`

When a lesson is completed, the database recieves a query like this:

```
MATCH (learner:Learner {uniqueId: "rob-who-learns-stuff"})
MATCH (lesson:TopicLesson {name: "Hello"})
CREATE (learner)-[:COMPLETED {timestamp: datetime('2019-02-16T12:42:50.123+00:00'), timeTakenSeconds: 184, lessonAccuracy: 90.5}]->(lessson)
```