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
    let testHomePage = shallow(<LessonMap location="http://localhost:3000/courses/georgian" />)
    let coursesLink = testHomePage.find('p').first()
    let lessonMapText = coursesLink.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)
    expect(text).toBe("This is a lesson map for the georgian course")
})