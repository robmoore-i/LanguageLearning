// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import CourseButton from '../../main/CourseButton'
// Enzyme react-adapter configuration
import {configureAdapter} from "../utils"

configureAdapter()

const stubAnalytics = {recordEvent: jest.fn()}

it('Encodes the image src into base64 if the image is an svg', () => {
    let svgUtf8 = "--svg-data--"
    let testCourseButton = shallow(<CourseButton courseName="Graphics" image={{type: "svg", src: svgUtf8}}
                                                 analytics={stubAnalytics}/>)

    let courseIcon = testCourseButton.find(".Course-icon")

    // "LS1zdmctZGF0YS0t" is equivilant to `btoa(svgUtf8)`, the base64 encoding of svgUtf8.
    expect(courseIcon.is('[src="data:image/svg+xml;base64,LS1zdmctZGF0YS0t"]')).toBe(true)
})

it("Leaves the fetched image src as it is if the image is a png, because it's already base 64 encoded by the server", () => {
    let pngUtf8 = "--png-data--"
    let testCourseButton = shallow(<CourseButton courseName="Graphics" image={{type: "png", src: pngUtf8}}
                                                 analytics={stubAnalytics}/>)

    let courseIcon = testCourseButton.find(".Course-icon")

    // "LS1zdmctZGF0YS0t" is equivilant to `btoa(svgUtf8)`, the base64 encoding of svgUtf8.
    expect(courseIcon.is('[src="data:image/png;base64,--png-data--"]')).toBe(true)
})

it("Changes the href depending on the window location to ensure that the path is appended properly", () => {
    let testCourseButton = mount(<CourseButton courseName="Georgian" image={{type: "svg", src: "--svg-data--"}}
                                               analytics={stubAnalytics}/>)
    testCourseButton.update()

    expect(testCourseButton.instance().makeHref("http://localhost:3000/courses/")).toEqual("Georgian")
    expect(testCourseButton.instance().makeHref("http://localhost:3000/courses")).toEqual("courses/Georgian")
})
