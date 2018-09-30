// React
import React from 'react'

// Testing
import { shallow } from 'enzyme'

// Main
import Courses from '../main/Courses'

// Enzyme react-adapter configuration
import {configureAdapter} from "./setup"

configureAdapter()

it('directs the user to courses/georgian upon pressing the [georgian flag]', () => {
    let testCoursesPage = shallow(<Courses />)
    let georgianCourseButton = testCoursesPage.find('#course-button-georgian').dive()
    let georgianCourseLink = georgianCourseButton.find('#course-link-georgian').first()
    expect(georgianCourseLink.is('[to="courses/georgian"]')).toBe(true)
})

it('directs the user to courses/german upon pressing the [german flag]', () => {
    let testCoursesPage = shallow(<Courses />)
    let germanCourseButton = testCoursesPage.find('#course-button-german').dive()
    let germanCourseLink = germanCourseButton.find('#course-link-german').first()
    expect(germanCourseLink.is('[to="courses/german"]')).toBe(true)
})