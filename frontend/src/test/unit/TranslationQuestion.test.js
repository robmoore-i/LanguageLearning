// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import TranslationQuestion from '../../main/TranslationQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter, textBoxInputEvent} from "../utils"

configureAdapter()

it('Shows the question of a translation question', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = shallow(<TranslationQuestion q={q} />)

    expect(testTQ.find("#question-title-instruction").text()).toBe("What is the translation of")
    expect(testTQ.find("#question-title-given").text()).toBe("hello")
})

it('Marks a correct answer as correct', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} />)

    let inputBox = testTQ.find("#answer-input-textbox")
    let testInput = "გამარჯობა"
    inputBox.simulate("change", textBoxInputEvent(testInput))

    let markButton = testTQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testTQ.find("#question-result-correct").exists()).toBe(true)
})

it('Marks an incorrect answer as incorrect', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} />)

    let inputBox = testTQ.find("#answer-input-textbox")
    let testInput = "memes"
    inputBox.simulate("change", textBoxInputEvent(testInput))

    let markButton = testTQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testTQ.find("#question-result-incorrect").exists()).toBe(true)
})

it('Wont mark an empty string as an answer', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = mount(<TranslationQuestion q={q} />)

    let markButton = testTQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testTQ.find("#question-result-incorrect").exists()).toBe(false)
    expect(testTQ.find("#question-result-correct").exists()).toBe(false)
    expect(testTQ.find("#question-result-unmarked").exists()).toBe(true)
})

it('Transforms submit button into continue button after correct answer', () => {
    let correctAnswer = "გამარჯობა"

    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} />)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#submit-for-marking-button").simulate("click")

    expect(testTQ.find("#submit-for-marking-button").exists()).toBe(false)
    expect(testTQ.find("#continue-button").exists()).toBe(true)
})

it('Calls the question completion listener when question answered correctly', () => {
    let correctAnswer = "გამარჯობა"

    let questionCompleted = jest.fn()
    let q = {type: 0, given: "hello", answer: correctAnswer}
    let testTQ = mount(<TranslationQuestion q={q} completionListener={questionCompleted} />)

    testTQ.find("#answer-input-textbox").simulate("change", textBoxInputEvent(correctAnswer))
    testTQ.find("#submit-for-marking-button").simulate("click")
    testTQ.find("#continue-button").simulate("click")

    expect(questionCompleted).toHaveBeenCalled()
})