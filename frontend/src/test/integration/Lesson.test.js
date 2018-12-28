// React
import React from 'react'

// Testing
import {mount} from 'enzyme'

// Main
import Lesson from '../../main/Lesson'
import {encodeUrl} from "../../main/App"
import {nonShuffler} from "../../main/Shuffler"

// Enzyme react-adapter configuration & others
import {configureAdapter, sleep, textBoxInputEvent, questionSubmitAndContinue} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lesson => {
    return {
        fetchLesson: (lessonNameInUrl) => {
            return new Promise(resolve => resolve(lesson))
        }
    }
}

it('Can advance through an MCQ and a TQ in index order', async () => {
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {index: 1, type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [mcq, tq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName={encodeUrl("hello")} server={testServer} shuffler={nonShuffler} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // MCQ
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    // TQ
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    questionSubmitAndContinue(testLesson)

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 100%")
})

it('Can repeats TQ and MCQ if answered incorrectly', async () => {
    let tq = {index: 1, type: 0, given: "hello", answer: "გამარჯობა"}
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testServer = mockServer({name: "Hello!", questions: [tq, mcq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName={encodeUrl("hello")} server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // TQ Incorrect
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    testLesson.find("#continue-button").simulate("click")

    // MCQ Incorrect
    testLesson.find("#choice-c").simulate("click")
    questionSubmitAndContinue(testLesson)

    // TQ Repeated
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    questionSubmitAndContinue(testLesson)

    // MCQ Repeated
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 50%")
})

it('Repeats a question even if its the last question', async () => {
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testServer = mockServer({name: "Hello!", questions: [mcq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName={encodeUrl("hello")} server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // MCQ Incorrect
    testLesson.find("#choice-c").simulate("click")
    questionSubmitAndContinue(testLesson)

    // MCQ Repeated
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 50%")
})

it('Gets a reasonably accurate reading on the lesson time', async () => {
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {index: 1, type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [mcq, tq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName={encodeUrl("hello")} server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    let testDurationSeconds = 120
    let mockStartTime = new Date((new Date()).getTime() - 1000 * testDurationSeconds)
    await testLesson.setState({startTime: mockStartTime})

    // MCQ
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    // TQ
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    questionSubmitAndContinue(testLesson)

    let text = testLesson.find("#lesson-time").text()
    let num = Number(text.split(" ")[2])
    expect(num).toBeGreaterThan(testDurationSeconds)
    expect(num).toBeLessThan(testDurationSeconds + 1)
})

it('Records if an RQ was answered incorrectly without repeating it', async () => {
    let rq = {index: 0, type: 2, extract: "Vlad went to the kitchen and got some cake", questions: [{given: "Where did Vlad go?", answer: "Kitchen"}]}
    let mcq = {index: 1, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {index: 2, type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [rq, mcq, tq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName={encodeUrl("hello")} server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // RQ
    testLesson.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Wrong"))
    questionSubmitAndContinue(testLesson)

    // MCQ
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    // TQ
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    questionSubmitAndContinue(testLesson)

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 66.7%")
})

it('Records the correctness of reading subquestions when determining overall accuracy', async () => {
    let rq = {index: 0, type: 2, extract: "Vlad went to the kitchen and got some cake",
      questions: [
        {given: "Where did Vlad go?", answer: "Kitchen"},
        {given: "What did he get there?", answer: "Cake"},
        {given: "How much if it did he get?", answer: "Some"}
      ]}
    let mcq = {index: 1, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {index: 2, type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [rq, mcq, tq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName={encodeUrl("hello")} server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    // RQ
    testLesson.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Kitchen"))
    testLesson.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
    testLesson.find("#answer-input-textbox-2").simulate("change", textBoxInputEvent("Wrong"))
    questionSubmitAndContinue(testLesson)

    // MCQ
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    // TQ
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    questionSubmitAndContinue(testLesson)

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 80%")
})
