// React
import React from 'react'
import ReactDOM from 'react-dom'

// Main
import App from '../main/App'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App/>, div)
    ReactDOM.unmountComponentAtNode(div)
})