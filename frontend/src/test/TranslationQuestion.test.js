// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import TranslationQuestion from '../main/TranslationQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter, textBoxInputEvent} from "./utils"

configureAdapter()

it('Shows the question of a translation question', () => {
    let q = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testTQ = shallow(<TranslationQuestion q={q} />)

    let questionTitle = testTQ.find("#question-title")

    expect(questionTitle.text()).toBe("Translate \"hello\"")
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