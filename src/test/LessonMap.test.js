// React
import React from 'react'

// Testing
import { shallow } from 'enzyme'

// Main
import LessonMap from '../main/LessonMap'

// Enzyme react-adapter configuration
import {configureAdapter} from "./setup"

configureAdapter()

it('shows the correct course name depending on the url', () => {
    let testServer = {fetchLessonNames: () => {return ["hello", "goodbye"]}}
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/georgian" server={testServer} />)
    let content = testLessonMap.find('p').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)
    expect(text).toBe("This is a lesson map for the georgian course")
})

it('populates the lesson map with the lessons fetched from the server', () => {
    let testServer = {fetchLessonNames: () => {return ["hello", "goodbye"]}}
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/georgian" server={testServer} />)
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children()).toHaveLength(2)
})