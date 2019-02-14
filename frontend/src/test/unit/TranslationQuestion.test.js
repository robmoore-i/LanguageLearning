// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import TranslationQuestion from '../../main/TranslationQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter, doNothing, questionSubmitAndContinue, stubAnalytics, textBoxInputEvent} from "../utils"

configureAdapter()

it('Shows the question of a translation question', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = shallow(<TranslationQuestion q={q} analytics={stubAnalytics}/>)

    // Note: The trailing spaces are important, because when copy-pasting the given text, when I double click it,
    //       it should highlight only that, not the word "of" or the image as though they were joined.
    expect(testTQ.find("#question-instruction").text()).toBe("What is the translation of ")
    expect(testTQ.find("#question-given").text()).toBe("hello ")
})

it('Marks a correct answer as correct', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} analytics={stubAnalytics}/>)

    let inputBox = testTQ.find("#answer-input-textbox")
    let testInput = "გამარჯობა"
    inputBox.simulate("change", textBoxInputEvent(testInput))

    let markButton = testTQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testTQ.find("#question-result-correct").exists()).toBe(true)
})

it('Marks an incorrect answer as incorrect', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} analytics={stubAnalytics}/>)

    let inputBox = testTQ.find("#answer-input-textbox")
    let testInput = "memes"
    inputBox.simulate("change", textBoxInputEvent(testInput))

    let markButton = testTQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testTQ.find("#question-result-incorrect").exists()).toBe(true)
})

it('Wont mark an empty string as an answer', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} analytics={stubAnalytics}/>)

    let markButton = testTQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testTQ.find("#question-result-incorrect").exists()).toBe(false)
    expect(testTQ.find("#question-result-correct").exists()).toBe(false)
    expect(testTQ.find("#question-result-unmarked").exists()).toBe(true)
})

it('Transforms submit button into continue button after correct answer', () => {
    let correctAnswer = "გამარჯობა"

    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#submit-for-marking-button").simulate("click")

    expect(testTQ.find("#submit-for-marking-button").exists()).toBe(false)
    expect(testTQ.find("#continue-button").exists()).toBe(true)
})

it('Calls the onCorrect completion listener after clicking continue when question answered correctly', () => {
    let correctAnswer = "გამარჯობა"

    let questionCompletedCorrectly = jest.fn()
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    questionSubmitAndContinue(testTQ)

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Disables continue button when question answered incorrectly', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testTQ.find("#submit-for-marking-button").simulate("click")

    expect(testTQ.find("#continue-button").is(".mark-continue-button-disabled")).toEqual(true)
})

it('Prompts for correction when question answered incorrectly', () => {
    let correctAnswer = "გამარჯობა"

    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testTQ.find("#submit-for-marking-button").simulate("click")

    // Note: The trailing space is important, because when copy-pasting the correct, when I double click the answer,
    //       it should highlight only the correction, not the word "answer" as well, as though they were joined.
    expect(testTQ.find("#correction-prompt").text()).toEqual("Type out the correct answer ")
    expect(testTQ.find("#correction-answer").text()).toEqual(correctAnswer)
})

it('Doesnt call either the onCorrect or onIncorrect completion listeners when disabled continue button is clicked', () => {
    let correctAnswer = "გამარჯობა"

    let questionCompletedCorrectly = jest.fn()
    let questionCompletedIncorrectly = jest.fn()
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly}
                                            onIncorrect={questionCompletedIncorrectly} analytics={stubAnalytics}/>)
    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    questionSubmitAndContinue(testTQ)

    expect(questionCompletedCorrectly).toHaveBeenCalledTimes(0)
    expect(questionCompletedIncorrectly).toHaveBeenCalledTimes(0)
})

it('Enables the previously disabled continue button when the correction is typed out', () => {
    let correctAnswer = "გამარჯობა"

    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testTQ.find("#submit-for-marking-button").simulate("click")
    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))

    expect(testTQ.find("#continue-button").is(".mark-continue-button")).toEqual(true)
})

it('Disables typing into the text area once the correction is typed out', () => {
    let correctAnswer = "გამარჯობა"

    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testTQ.find("#submit-for-marking-button").simulate("click")
    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))

    expect(testTQ.find("#answer-input-textbox").prop("readOnly")).toEqual(true)
})

it('Text area becomes read-only if a correct answer is marked', () => {
    let correctAnswer = "გამარჯობა"

    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#submit-for-marking-button").simulate("click")

    expect(testTQ.find("#answer-input-textbox").prop("readOnly")).toEqual(true)
})

it('Calls the onIncorrect completion listener after clicking continue when question answered incorrectly, then corrected', () => {
    let correctAnswer = "გამარჯობა"

    let questionCompletedIncorrectly = jest.fn()
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} onIncorrect={questionCompletedIncorrectly}
                                            analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong answer"))
    testTQ.find("#submit-for-marking-button").simulate("click")
    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#continue-button").simulate("click")

    expect(questionCompletedIncorrectly).toHaveBeenCalled()
})

it('Ignores whitespace, case, commas, fullstops, exclamation marks and question mark when marking', () => {
    let correctAnswer = "What are you called?"

    let questionCompletedCorrectly = jest.fn()
    let q = {type: 0, given: "შენ რა გქვია?", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("  WhaT!  aRe,   yOU! callED.     "))
    questionSubmitAndContinue(testTQ)

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Can submit for marking using enter key', () => {
    let correctAnswer = "What are you called?"

    let q = {type: 0, given: "შენ რა გქვია?", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#answer-input-textbox").simulate("keydown", {key: "Enter"})

    expect(testTQ.find("#submit-for-marking-button").exists()).toBe(false)
    expect(testTQ.find("#continue-button").exists()).toBe(true)
})

it('Can continue using enter key', () => {
    let correctAnswer = "What are you called?"

    let q = {type: 0, given: "შენ რა გქვია?", answer: correctAnswer}
    let questionCompletedCorrectly = jest.fn()
    let testTQ = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#answer-input-textbox").simulate("keydown", {key: "Enter"})
    testTQ.find("#answer-input-textbox").simulate("keydown", {key: "Enter"})

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Ignores whitespace, case, commas, fullstops, exclamation marks and question mark when checking a correction', () => {
    let correctAnswer = "What are you called?"

    let questionCompletedCorrectly = jest.fn()
    let q = {type: 0, given: "შენ რა გქვია?", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("wrong"))
    testTQ.find("#submit-for-marking-button").simulate("click")
    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("  WhaT!  aRe,   yOU! callED.     "))

    expect(testTQ.find("#answer-input-textbox").prop("readOnly")).toEqual(true)
})

it('Autofocuses text area input box', () => {
    let q = {type: 0, given: "შენ რა გქვია?", answer: "What are you called?"}
    mount(<TranslationQuestion q={q}/>)

    expect("answer-input-textbox").toEqual(document.activeElement.id)
})

it("Sends analytics message when correct answer submitted", () => {
    let analytics = {recordEvent: jest.fn()}
    let correctAnswer = "გამარჯობა"

    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} analytics={analytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#submit-for-marking-button").simulate("click")

    expect(analytics.recordEvent).toHaveBeenCalledWith("submit@mark-answer-button&click&correct#translationquestion-hello->გამარჯობა")
})

it("Sends analytics message when incorrect answer submitted", () => {
    let analytics = {recordEvent: jest.fn()}

    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} analytics={analytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("incorrect-answer"))
    testTQ.find("#submit-for-marking-button").simulate("click")

    expect(analytics.recordEvent).toHaveBeenCalledWith("submit@mark-answer-button&click&incorrect#translationquestion-hello->incorrect-answer")
})

it("Sends analytics message when correction completed", () => {
    let analytics = {recordEvent: jest.fn()}

    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} analytics={analytics}/>)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("incorrect-answer"))
    testTQ.find("#submit-for-marking-button").simulate("click")
    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent("გამარჯობა"))

    expect(analytics.recordEvent).toHaveBeenCalledWith("corrected#translationquestion-hello->incorrect-answer->გამარჯობა")
})