// React
import React from 'react'

// Testing
import { shallow, mount } from 'enzyme'

// Main
import CourseButton from '../../main/CourseButton'

// Enzyme react-adapter configuration
import {configureAdapter} from "../utils"

configureAdapter()

it('Encodes the image src into base64 if the image is an svg', () => {
    let svgUtf8 = "--svg-data--"
    let testCourseButton = shallow(<CourseButton courseName="Graphics" image={{type: "svg", src: svgUtf8}} />)

    let courseIcon = testCourseButton.find(".Course-icon")

    // "LS1zdmctZGF0YS0t" is equivilant to `btoa(svgUtf8)`, the base64 encoding of svgUtf8.
    expect(courseIcon.is('[src="data:image/svg+xml;base64,LS1zdmctZGF0YS0t"]')).toBe(true)
})