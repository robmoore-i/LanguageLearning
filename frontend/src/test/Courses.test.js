// React
import React from 'react'

// Testing
import { shallow } from 'enzyme'

// Main
import Courses from '../main/Courses'

// Enzyme react-adapter configuration
import {configureAdapter} from "./utils"

configureAdapter()

it('directs the user to courses/georgian upon pressing the [georgian flag]', () => {
    // Given: I am on the courses page
    let testCoursesPage = shallow(<Courses />)

    // When: I press the georgian course button
    let georgianCourseButton = testCoursesPage.find('#course-button-georgian').dive()
    let georgianCourseLink = georgianCourseButton.find('#course-link-georgian').first()

    // Then: I am redirected to /courses/georgian
    expect(georgianCourseLink.is('[to="courses/georgian"]')).toBe(true)
})

it('directs the user to courses/german upon pressing the [german flag]', () => {
    // Given: I am on the courses page
    let testCoursesPage = shallow(<Courses />)

    // When: I press the german course button
    let germanCourseButton = testCoursesPage.find('#course-button-german').dive()
    let germanCourseLink = germanCourseButton.find('#course-link-german').first()

    // Then: I am redirected to /courses/german
    expect(germanCourseLink.is('[to="courses/german"]')).toBe(true)
})