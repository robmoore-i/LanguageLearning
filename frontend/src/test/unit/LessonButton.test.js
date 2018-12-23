// React
import React from 'react'

// Testing
import { shallow, mount } from 'enzyme'

// Main
import LessonButton from "../../main/LessonButton"

// Enzyme react-adapter configuration
import {configureAdapter} from "../utils"

configureAdapter()

it("Changes the href depending on the window location to ensure that the path is appended properly", () => {
    let testLessonButton = mount(<LessonButton courseName="Georgian" lessonName="Hello" />)
    testLessonButton.update()

    expect(testLessonButton.instance().makeHref("http://localhost:3000/courses/Georgian/")).toEqual("Hello")
    expect(testLessonButton.instance().makeHref("http://localhost:3000/courses/Georgian")).toEqual("Georgian/Hello")
})

it('Creates links to lessons from the provided lesson data', async () => {
    let dogeLessonButton = shallow(<LessonButton courseName="spanish" lessonName="doge" />)
    let pepeLessonButton = shallow(<LessonButton courseName="spanish" lessonName="pepe" />)

    expect(dogeLessonButton.is('[href="doge"]')).toBe(true)
    expect(pepeLessonButton.is('[href="pepe"]')).toBe(true)
})

it('Encodes lesson names which have spaces or punctuation', async () => {
    let lessonButton = shallow(<LessonButton courseName="edgecases" lessonName="A lesson that shouldn't be in a url" />)

    expect(lessonButton.is('[href="A_lesson_that_shouldn\'t_be_in_a_url"]')).toBe(true)
})
