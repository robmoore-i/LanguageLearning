// React
import React from 'react'
// Testing
import {mount} from 'enzyme'
// Main
import Lesson from '../../main/Lesson'
import {nonShuffler} from "../../main/Shuffler"
// Enzyme react-adapter configuration & others
import {configureAdapter, questionSubmitAndContinue, sleep, stubAnalytics, textBoxInputEvent} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lesson => {
    return {
        fetchLesson: () => {
            return new Promise(resolve => resolve(lesson))
        }
    }
}

async function mountRenderLesson(course, lessonName, server) {
    let lesson = mount(<Lesson courseName={course} encodedLessonName={encodeURIComponent(lessonName)} server={server}
                               shuffler={nonShuffler} analytics={stubAnalytics}/>)
    await sleep(mockServerLoadTimeMs)
    lesson.update()
    return lesson
}

it('Can advance through an MCQ and a TQ in index order', async () => {
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {index: 1, type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [mcq, tq]})
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)

    // MCQ
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    // TQ
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    questionSubmitAndContinue(testLesson)

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 100%")
})

it('Repeats TQ and MCQ if they are both answered incorrectly', async () => {
    let tq = {index: 1, type: 0, given: "hello", answer: "გამარჯობა"}
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testServer = mockServer({name: "Hello!", questions: [mcq, tq]})
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)

    // MCQ Incorrect
    testLesson.find("#choice-c").simulate("click")
    questionSubmitAndContinue(testLesson)

    // MCQ Repeated
    testLesson.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testLesson)

    // TQ Incorrect
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testLesson.find("#submit-for-marking-button").simulate("click")
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    testLesson.find("#continue-button").simulate("click")

    // TQ Repeated
    testLesson.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))
    questionSubmitAndContinue(testLesson)

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 50%")
})

it('Repeats an incorrectly answered question even if its the last question', async () => {
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testServer = mockServer({name: "Hello!", questions: [mcq]})
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)

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
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)

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
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)

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
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)

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

it('Shows the lesson stats page when all questions are complete', async () => {
    let dummyQuestion = {type: -1}
    let testServer = mockServer({name: "Hello!", questions: [dummyQuestion, dummyQuestion, dummyQuestion, dummyQuestion]})
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)
    testLesson.setState({questionQueue: {completedAllQuestions: () => true}, correct: 4, incorrect: 0})
    testLesson.update()

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 100%")
})

it('Accurately shows a lesson accuracy of less than 100% when appropriate', async () => {
    let dummyQuestion = {type: -1}
    let testServer = mockServer({name: "Hello!", questions: [dummyQuestion, dummyQuestion, dummyQuestion, dummyQuestion]})
    let testLesson = await mountRenderLesson("Georgian", "hello", testServer)
    testLesson.setState({questionQueue: {completedAllQuestions: () => true}, correct: 4, incorrect: 6})
    testLesson.update()

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 40%")
})

it('Shows an MCQ with only three choices', async () => {
    let mcq = {index: 0, type: 1, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", d: "!", answer: "c"}
    let testServer = mockServer({name: "3 Choices", questions: [mcq]})
    let testLesson = await mountRenderLesson("Georgian", "3 Choices", testServer)

    expect(testLesson.find("#choiceValue-a").text()).toBe("ა")
    expect(testLesson.find("#choiceValue-b").text()).toBe("ო")
    expect(testLesson.find("#choiceValue-c").text()).toBe("უ")
    expect(testLesson.find("#choiceValue-d").exists()).toBe(false)
})

it('Pushes incorrectly answered MCQ only back up to the next RQ', async () => {
    let rq1 = {type: 2, extract: "First you'll learn about the alphabet!", questions: [], index: 0}
    let mcq1 = {type: 1, index: 1, question: "sounds like \"a\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "a"}
    let mcq2 = {type: 1, index: 2, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let rq2 = {type: 2, extract: "Next you'll learn a word.", questions: [], index: 3}
    let tq = {type: 0, index: 4, given: "hello", answer: "გამარჯობა"}

    let testServer = mockServer({name: "Hello!", questions: [rq1, mcq1, mcq2, rq2, tq]})
    let testLesson = await mountRenderLesson("georgian", "hello", testServer)

    let completionHandlers = testLesson.instance().questionCompletionHandlers()

    completionHandlers.onCompletion(0, 0)
    completionHandlers.onIncorrect()
    completionHandlers.onCorrect()

    expect(testLesson.state("questionQueue").currentQuestion()).toEqual(mcq1)
})

it('Adds incorrectly answered translation question back into the questions list', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [tq]})
    let testLesson = await mountRenderLesson("georgian", "hello", testServer)

    let completionHandlers = testLesson.instance().questionCompletionHandlers()
    completionHandlers.onIncorrect()

    expect(testLesson.state("questionQueue").count()).toEqual(2)
})

it('Completes when the the incorrect then correct completion handlers are called', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [tq]})
    let testLesson = await mountRenderLesson("georgian", "hello", testServer)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    let completionHandlers = testLesson.instance().questionCompletionHandlers()
    completionHandlers.onIncorrect()
    testLesson.update()
    let completionHandlers2 = testLesson.instance().questionCompletionHandlers()
    completionHandlers2.onCorrect()

    let questionQueue = testLesson.state("questionQueue");
    expect(questionQueue.count()).toEqual(2)
    expect(questionQueue.currentIndex()).toEqual(2)
})