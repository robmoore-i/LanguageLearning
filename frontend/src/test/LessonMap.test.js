// React
import React from 'react'

// Testing
import { shallow } from 'enzyme'

// Main
import LessonMap from '../main/LessonMap'

// Enzyme react-adapter configuration
import {configureAdapter} from "./setup"

configureAdapter()

let dummyServer = {fetchLessonNames: () => {return []}}

it('shows the correct course name depending on the url', () => {
    // Given: I am on the lesson map page for Thai
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/thai" server={dummyServer} />)

    // When: I look around the page
    let content = testLessonMap.find('h1').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)

    // Then: I see that Thai is in the title
    expect(text).toBe("Choose a thai lesson")
})

it('populates the lesson map with the lessons fetched from the server', () => {
    // Given: There are two lessons available on the server
    let testServer = {fetchLessonNames: () => {return ["hello", "goodbye"]}}

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/georgian" server={testServer} />)

    // Then: I see the two available lessons on the lesson list
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children()).toHaveLength(2)
})

it('fills in the correct lesson data for the lessons of the lesson map', () => {
    // Given: There are two lessons available on the server, named 'a' and 'b'
    let testServer = {fetchLessonNames: () => {return ["a", "b"]}}

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/german" server={testServer} />)

    // Then: I see the names of the two lessons on the lesson list
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children().at(0).dive().childAt(0).text()).toEqual("a")
    expect(lessonsList.children().at(1).dive().childAt(0).text()).toEqual("b")
})

it('creates links to lessons from the provided lesson data', () => {
    // Given: There are two lessons available on the server, named 'doge' and 'pepe'
    let testServer = {fetchLessonNames: () => {return ["doge", "pepe"]}}

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/spanish" server={testServer} />)

    // Then: The links go to the appropriate lessons
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    let dogeLessonButton = lessonsList.children().at(0).dive()
    let pepeLessonButton = lessonsList.children().at(1).dive()

    expect(dogeLessonButton.is('[to="spanish/doge"]')).toBe(true)
    expect(pepeLessonButton.is('[to="spanish/pepe"]')).toBe(true)
})

it('homogenises lesson names which have spaces or punctuation', () => {
    // Given: There is a lesson available on the server whose name ought not to be put in a url as-is.
    let testServer = {fetchLessonNames: () => {return ["A lesson that shouldn't be in a url"]}}

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/edgecases" server={testServer} />)

    // Then: The link is sensibly cleaned up
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    let lessonButton = lessonsList.children().at(0).dive()

    expect(lessonButton.is('[to="edgecases/A_lesson_that_shouldnt_be_in_a_url"]')).toBe(true)
})

it('shows correct link text for lesson names with spaces or punctuation', () => {
    // Given: There is a lesson available on the server whose name ought not to be put in a url as-is.
    let testServer = {fetchLessonNames: () => {return ["A lesson that shouldn't be in a url"]}}

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/edgecases" server={testServer} />)

    // Then: The text on the link button is still the same as the real lesson name
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    let lessonButton = lessonsList.children().at(0).dive()

    expect(lessonButton.childAt(0).text()).toEqual("A lesson that shouldn't be in a url")
})