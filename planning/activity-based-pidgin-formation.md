# Multi-feature: Guide users to create pidgin languages based on activities
#                they do every day.

## Motivation

As a learner I want to be able to use what I've learnt every day. Therefore I
want to learn things that I can use every day in things that I would do in my
native language anyway.

## Simplest Solution

After picking the Course from the Courses page, you are presented with the
activities page. It prompts you: "What do you do every day?". It then shows a
list of common activities with familiar iconography. Each of these will have
a lesson list, where each lesson corresponds to a specific sub-activity. The
term for these shall be "Moment".

For example, an activity might be: "Build Software", whose icon will be a
html-tag sort of thing.

Examples of its Moments might be "Writing Code", "Planning" and "Reading
Documentation".

First ones I'll do will be "Commuting", "Going out for lunch", "Making lunch"
and "Eating lunch". These are times when people often do their language
learning, so by making the learnings relevant to these times, people can
form their pidgin and practice.

## Implementation

### Frontend

The Courses page will now redirect to the Activities page, where activities
are listed. The list of Activities and their icons are fetched from the
server in much the same way as Courses.

Clicking an Activity button will redirect to the Moments page, containing
lessons.

### Server

Return a list of available activities for a given course.

### Database

Storage hierarchy changed to be Courses * -> * Activities 1 -> * Lessons. A
single Activity can be implemented in multiple courses.
