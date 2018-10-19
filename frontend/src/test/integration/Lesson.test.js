// React
import React from 'react'
// Testing
import {mount} from 'enzyme'
// Main
import Lesson from '../../main/Lesson'
// Enzyme react-adapter configuration & others
import {configureAdapter, sleep, textBoxInputEvent} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lesson => {
    return {
        fetchLesson: (lessonNameInUrl) => {
            return new Promise(resolve => resolve(lesson))
        }
    }
}

it('can advance through an MCQ and TQ', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testServer = mockServer({name: "Hello!", questions: [mcq, tq]})
    let testLesson = mount(<Lesson courseName="georgian" lessonNameInUrl="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // MCQ
    testLesson.find("#choice-d").simulate("click")
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    // TQ
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    expect(testLesson.find("div").text()).toEqual("Ya Dun m8")
})