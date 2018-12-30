// React
import React from 'react'

// Testing
import {shallow} from 'enzyme'

// Main
import LessonStats from '../../main/LessonStats'

// Enzyme react-adapter configuration & others
import {configureAdapter} from "../utils"

configureAdapter()

it('Shows the lesson time and accuracy', () => {
    let lessonStats = shallow(<LessonStats courseName="georgian" accuracyPercentage={85.3} lessonTime={100.0} />)

    expect(lessonStats.find("#lesson-accuracy-number").text()).toEqual("85.3%")
    expect(lessonStats.find("#lesson-time-number").text()).toEqual("100 seconds")
})

it('Truncates lesson accuracy to 1dp', () => {
    let lessonStats = shallow(<LessonStats courseName="georgian" accuracyPercentage={67.6666666666666667} lessonTime={55.3} />)

    expect(lessonStats.find("#lesson-accuracy-number").text()).toEqual("67.7%")
    expect(lessonStats.find("#lesson-time-number").text()).toEqual("55.3 seconds")
})

it('Has a button to go back to the lesson map after completing a lesson', () => {
    let lessonStats = shallow(<LessonStats courseName="arabic" accuracyPercentage={67.6666666666666667} lessonTime={55.3} />)

    expect(lessonStats.find("#back-to-lessonmap-button").is('[href="/courses/arabic"]')).toBe(true)
})

it('Shows 100% accuracy if passed null or NaN', () => {
    let lessonStats = shallow(<LessonStats courseName="georgian" accuracyPercentage={NaN} lessonTime={50.0} />)

    expect(lessonStats.find("#lesson-accuracy-number").text()).toEqual("100%")
    expect(lessonStats.find("#lesson-time-number").text()).toEqual("50 seconds")
})
