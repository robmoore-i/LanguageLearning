// React
import React from 'react'
import ReactDOM from 'react-dom'

// Testing
import { mount } from 'enzyme'
import { followLink, assertHasChild } from './utils'

// Main
import App from '../main/App'

// Enzyme react-adapter configuration
import "./setup"

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App/>, div)
    ReactDOM.unmountComponentAtNode(div)
})

describe('routing from the home page', () => {
    it('directs the user to the courses page upon pressing the [Get Started] button', () => {
        let testApp = mount(<App />)
        let coursesLink = testApp.find('#courses-link').first() //.last() also works?
        followLink(coursesLink)
        assertHasChild(testApp, '.Courses-list')
    })
})