// React
import React from 'react'

// Testing
import { shallow } from 'enzyme'

// Main
import Home from '../../main/Home'

// Enzyme react-adapter configuration
import {configureAdapter} from "../utils"

configureAdapter()

it('directs the user to /courses upon pressing the [Get Started] button', () => {
    // Given: I'm on the home page
    let testHomePage = shallow(<Home />)

    // When: I click the link to the courses page
    let coursesLink = testHomePage.find('#courses-link').first()

    // Then: I am redirected to /courses
    expect(coursesLink.is('[to="courses"]')).toBe(true)
})