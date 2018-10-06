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
    // Given: There are two lessons available on the server, named 'hello' and 'goodbye'
    let testServer = {fetchLessonNames: () => {return ["hello", "goodbye"]}}

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/german" server={testServer} />)

    // Then: I see the names of the two lessons on the lesson list
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children().at(0).dive().text()).toEqual("hello")
    expect(lessonsList.children().at(1).dive().text()).toEqual("goodbye")
})