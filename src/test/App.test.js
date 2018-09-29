// React
import React from 'react'
import ReactDOM from 'react-dom'

// Testing
import { mount } from 'enzyme'
import { followLink, assertHasChild } from './melange-test'

// Main
import App from '../main/App'

// Enzyme react-adapter configuration
import "./setup-test"

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App/>, div)
    ReactDOM.unmountComponentAtNode(div)
})

describe('routing from the home page', () => {
    it('directs the user to the lesson map upon pressing the [Get Started] button', () => {
        let testApp = mount(<App />)
        let lessonMapLink = testApp.find('#lesson-map-link').first() //.last() also works?
        followLink(lessonMapLink)
        assertHasChild(testApp, '.Lesson-map')
    })
})