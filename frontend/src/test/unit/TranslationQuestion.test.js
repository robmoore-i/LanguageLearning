// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import TranslationQuestion from '../../main/TranslationQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter, doNothing, questionSubmitAndContinue, stubAnalytics, textBoxInputEvent} from "../utils"

configureAdapter()

function clickSubmitForMarkingButton(tqComponent) {
    tqComponent.find("#submit-for-marking-button").simulate("click")
}

function pressButtonWithEnterKey(tqComponent) {
    tqComponent.find("#answer-input-textbox").simulate("keydown", {key: "Enter"})
}

function typeAnswer(tqComponent, answer) {
    tqComponent.find("#answer-input-textbox").simulate("change", textBoxInputEvent(answer))
}

it('Shows the question of a translation question', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = shallow(<TranslationQuestion q={q} analytics={stubAnalytics}/>)

    // Note: The trailing spaces are important, because when copy-pasting the given text, when I double click it,
    //       it should highlight only that, not the word "of" or the image as though they were joined.
    expect(tq.find("#question-instruction").text()).toBe("What is the translation of ")
    expect(tq.find("#question-given").text()).toBe("hello ")
})

function mountTq(q) {
    return mount(<TranslationQuestion q={q} analytics={stubAnalytics}/>)
}

it('Marks a correct answer as correct', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = mountTq(q)

    typeAnswer(tq, "გამარჯობა")
    clickSubmitForMarkingButton(tq)

    expect(tq.find("#question-result-correct").exists()).toBe(true)
})

it('Marks an incorrect answer as incorrect', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = mountTq(q)

    typeAnswer(tq, "memes")
    clickSubmitForMarkingButton(tq)

    expect(tq.find("#question-result-incorrect").exists()).toBe(true)
})

it('Wont mark an empty string as an answer', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = mountTq(q)

    clickSubmitForMarkingButton(tq)

    expect(tq.find("#question-result-incorrect").exists()).toBe(false)
    expect(tq.find("#question-result-correct").exists()).toBe(false)
    expect(tq.find("#question-result-unmarked").exists()).toBe(true)
})

it('Transforms submit button into continue button after correct answer', () => {
    let correctAnswer = "გამარჯობა"
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let tq = mountTq(q)

    typeAnswer(tq, correctAnswer)
    clickSubmitForMarkingButton(tq)

    expect(tq.find("#submit-for-marking-button").exists()).toBe(false)
    expect(tq.find("#continue-button").exists()).toBe(true)
})

it('Calls the onCorrect completion listener after clicking continue when question answered correctly', () => {
    let correctAnswer = "გამარჯობა"
    let questionCompletedCorrectly = jest.fn()
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let tq = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    typeAnswer(tq, correctAnswer)
    questionSubmitAndContinue(tq)

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Disables continue button when question answered incorrectly', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    typeAnswer(tq, "wrong answer")
    clickSubmitForMarkingButton(tq)

    expect(tq.find("#continue-button").is(".mark-continue-button-disabled")).toEqual(true)
})

it('Prompts for correction when question answered incorrectly', () => {
    let correctAnswer = "გამარჯობა"
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let tq = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    typeAnswer(tq, "wrong answer")
    clickSubmitForMarkingButton(tq)

    // Note: The trailing space is important, because when copy-pasting the correct, when I double click the answer,
    //       it should highlight only the correction, not the word "answer" as well, as though they were joined.
    expect(tq.find("#correction-prompt").text()).toEqual("Type out the correct answer ")
    expect(tq.find("#correction-answer").text()).toEqual(correctAnswer)
})

it('Doesnt call either the onCorrect or onIncorrect completion listeners when disabled continue button is clicked', () => {
    let questionCompletedCorrectly = jest.fn()
    let questionCompletedIncorrectly = jest.fn()
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly}
                                        onIncorrect={questionCompletedIncorrectly} analytics={stubAnalytics}/>)

    typeAnswer(tq, "wrong answer")
    questionSubmitAndContinue(tq)

    expect(questionCompletedCorrectly).toHaveBeenCalledTimes(0)
    expect(questionCompletedIncorrectly).toHaveBeenCalledTimes(0)
})

it('Enables the previously disabled continue button when the correction is typed out', () => {
    let correctAnswer = "გამარჯობა"
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let tq = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    typeAnswer(tq, "wrong answer")
    clickSubmitForMarkingButton(tq)
    typeAnswer(tq, correctAnswer)

    expect(tq.find("#continue-button").is(".mark-continue-button")).toEqual(true)
})

it('Disables typing into the text area once the correction is typed out', () => {
    let correctAnswer = "გამარჯობა"
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let tq = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    typeAnswer(tq, "wrong answer")
    clickSubmitForMarkingButton(tq)
    typeAnswer(tq, correctAnswer)

    expect(tq.find("#answer-input-textbox").prop("readOnly")).toEqual(true)
})

it('Text area becomes read-only if a correct answer is marked', () => {
    let correctAnswer = "გამარჯობა"
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let tq = mount(<TranslationQuestion q={q} completionListener={doNothing} analytics={stubAnalytics}/>)

    typeAnswer(tq, correctAnswer)
    clickSubmitForMarkingButton(tq)

    expect(tq.find("#answer-input-textbox").prop("readOnly")).toEqual(true)
})

it('Calls the onIncorrect completion listener after clicking continue when question answered incorrectly, then corrected', () => {
    let correctAnswer = "გამარჯობა"
    let questionCompletedIncorrectly = jest.fn()
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let tq = mount(<TranslationQuestion q={q} onIncorrect={questionCompletedIncorrectly} analytics={stubAnalytics}/>)

    typeAnswer(tq, "wrong answer")
    clickSubmitForMarkingButton(tq)
    typeAnswer(tq, correctAnswer)
    tq.find("#continue-button").simulate("click")

    expect(questionCompletedIncorrectly).toHaveBeenCalled()
})

it('Ignores whitespace, case, commas, fullstops, exclamation marks and question mark when marking', () => {
    let questionCompletedCorrectly = jest.fn()
    let q = {type: 0, given: "შენ რა გქვია?", answer: "What are you called?"}
    let tq = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    typeAnswer(tq, "  WhaT!  aRe,   yOU! callED.     ")
    questionSubmitAndContinue(tq)

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Can submit for marking using enter key', () => {
    let correctAnswer = "What are you called?"
    let q = {type: 0, given: "შენ რა გქვია?", answer: correctAnswer}
    let tq = mountTq(q)

    typeAnswer(tq, correctAnswer)
    pressButtonWithEnterKey(tq)

    expect(tq.find("#submit-for-marking-button").exists()).toBe(false)
    expect(tq.find("#continue-button").exists()).toBe(true)
})

it('Can continue using enter key', () => {
    let correctAnswer = "What are you called?"
    let q = {type: 0, given: "შენ რა გქვია?", answer: correctAnswer}
    let questionCompletedCorrectly = jest.fn()
    let tq = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    typeAnswer(tq, correctAnswer)
    pressButtonWithEnterKey(tq)
    pressButtonWithEnterKey(tq)

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Ignores whitespace, case, commas, fullstops, exclamation marks and question mark when checking a correction', () => {
    let questionCompletedCorrectly = jest.fn()
    let q = {type: 0, given: "შენ რა გქვია?", answer: "What are you called?"}
    let tq = mount(<TranslationQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    typeAnswer(tq, "wrong")
    clickSubmitForMarkingButton(tq)
    typeAnswer(tq, "  WhaT!  aRe,   yOU! callED.     ")

    expect(tq.find("#answer-input-textbox").prop("readOnly")).toEqual(true)
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
    let tq = mount(<TranslationQuestion q={q} analytics={analytics}/>)

    typeAnswer(tq, correctAnswer)
    clickSubmitForMarkingButton(tq)

    expect(analytics.recordEvent).toHaveBeenCalledWith("submit@mark-answer-button&click&correct#translationquestion-hello->გამარჯობა")
})

it("Sends analytics message when incorrect answer submitted", () => {
    let analytics = {recordEvent: jest.fn()}
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = mount(<TranslationQuestion q={q} analytics={analytics}/>)

    typeAnswer(tq, "incorrect-answer")
    clickSubmitForMarkingButton(tq)

    expect(analytics.recordEvent).toHaveBeenCalledWith("submit@mark-answer-button&click&incorrect#translationquestion-hello->incorrect-answer")
})

it("Sends analytics message when correction completed", () => {
    let analytics = {recordEvent: jest.fn()}
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let tq = mount(<TranslationQuestion q={q} analytics={analytics}/>)

    typeAnswer(tq, "incorrect-answer")
    clickSubmitForMarkingButton(tq)
    typeAnswer(tq, "გამარჯობა")

    expect(analytics.recordEvent).toHaveBeenCalledWith("corrected#translationquestion-hello->incorrect-answer->გამარჯობა")
})