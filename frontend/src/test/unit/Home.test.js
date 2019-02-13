// React
import React from 'react'
// Testing
import {shallow} from 'enzyme'
// Main
import Home from '../../main/Home'
// Enzyme react-adapter configuration
import {configureAdapter, stubAnalytics} from "../utils"

configureAdapter()

it('Directs the user to /courses upon pressing the [Get Started] button', () => {
    // Given: I'm on the home page
    let testHomePage = shallow(<Home analytics={stubAnalytics}/>)

    // When: I click the link to the courses page
    let coursesLink = testHomePage.find('#courses-link').first()

    // Then: I am redirected to /courses
    expect(coursesLink.is('[to="courses"]')).toBe(true)
})

it('Calls the web analytics when the [Get Started] button is pressed', () => {
    let recordEvent = jest.fn()
    let mockAnalytics = {recordEvent: recordEvent}
    let testHomePage = shallow(<Home analytics={mockAnalytics}/>)

    testHomePage.find('#courses-link').first().simulate("click")

    expect(recordEvent).toHaveBeenCalledWith("click@get-started-button")
})