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
    let content = testLessonMap.find('h1').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)
    expect(text).toBe("Choose a georgian lesson")
})

it('populates the lesson map with the lessons fetched from the server', () => {
    let testServer = {fetchLessonNames: () => {return ["hello", "goodbye"]}}
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/georgian" server={testServer} />)
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children()).toHaveLength(2)
})

it('fills in the correct lesson data for the lessons of the lesson map', () => {
    let testServer = {fetchLessonNames: () => {return ["hello", "goodbye"]}}
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/georgian" server={testServer} />)
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children().at(0).dive().text()).toEqual("hello")
    expect(lessonsList.children().at(1).dive().text()).toEqual("goodbye")
})