// React
import React from 'react'

// Testing
import { shallow } from 'enzyme'

// Main
import Home from '../main/Home'

// Enzyme react-adapter configuration
import {configureAdapter} from "./setup"

configureAdapter()

it('directs the user to /courses upon pressing the [Get Started] button', () => {
    let testHomePage = shallow(<Home />)
    let coursesLink = testHomePage.find('#courses-link').last() //.last() also works?
    expect(coursesLink.is('[to="courses"]')).toBe(true)
})