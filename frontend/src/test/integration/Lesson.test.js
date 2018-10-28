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

it('can advance through an MCQ and a TQ', async () => {
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
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

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 100%")
})

it('can repeats TQ and MCQ if answered incorrectly', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testServer = mockServer({name: "Hello!", questions: [tq, mcq]})
    let testLesson = mount(<Lesson courseName="georgian" lessonNameInUrl="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // TQ Incorrect
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    testLesson.find("#continue-button").simulate("click")

    // MCQ Incorrect
    testLesson.find("#choice-c").simulate("click")
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    // TQ Repeated
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    // MCQ Repeated
    testLesson.find("#choice-d").simulate("click")
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 50%")
})

it('Repeats a question even if its the last question', async () => {
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testServer = mockServer({name: "Hello!", questions: [mcq]})
    let testLesson = mount(<Lesson courseName="georgian" lessonNameInUrl="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // MCQ Incorrect
    testLesson.find("#choice-c").simulate("click")
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    // MCQ Repeated
    testLesson.find("#choice-d").simulate("click")
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 50%")
})

it('Gets a reasonably accurate reading on the lesson time', async () => {
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [mcq, tq]})
    let testLesson = mount(<Lesson courseName="georgian" lessonNameInUrl="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    let testDurationSeconds = 120
    let mockStartTime = new Date((new Date()).getTime() - 1000 * testDurationSeconds)
    await testLesson.setState({startTime: mockStartTime})

    // MCQ
    testLesson.find("#choice-d").simulate("click")
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    // TQ
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#continue-button").simulate("click")

    let text = testLesson.find("#lesson-time").text()
    let num = Number(text.split(" ")[2])
    expect(num).toBeGreaterThan(testDurationSeconds)
    expect(num).toBeLessThan(testDurationSeconds + 1)
})