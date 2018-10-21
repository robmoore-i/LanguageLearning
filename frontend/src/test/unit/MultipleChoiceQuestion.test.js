// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import MultipleChoiceQuestion, {Choices} from '../../main/MultipleChoiceQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter} from "../utils"

configureAdapter()

it('Shows the question of a translation question', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#question").text()).toBe("Which of these sounds like \"i\" in English?")
})

it('Shows the four choices', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#choiceValue-a").text()).toBe("ა")
    expect(testMCQ.find("#choiceValue-b").text()).toBe("ო")
    expect(testMCQ.find("#choiceValue-c").text()).toBe("უ")
    expect(testMCQ.find("#choiceValue-d").text()).toBe("ი")
})

it('Can select a choice', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-a").simulate("click")

    expect(testMCQ.find("#choicebox-a").props().checked).toBe(true)
})

it('Can select only one choice at a time', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-a").simulate("click")
    testMCQ.find("#choice-b").simulate("click")

    expect(testMCQ.find("#choicebox-a").props().checked).toBe(false)
    expect(testMCQ.find("#choicebox-b").props().checked).toBe(true)
})

it('Marks a correct answer as correct', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-d").simulate("click")

    let markButton = testMCQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testMCQ.find("#question-result-correct").exists()).toBe(true)
})

it('Marks an incorrect answer as incorrect', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-c").simulate("click")

    let markButton = testMCQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testMCQ.find("#question-result-incorrect").exists()).toBe(true)
    expect(testMCQ.find("#question-result-correct").exists()).toBe(false)
})

it('Doesnt mark if no answer is given', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    let markButton = testMCQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testMCQ.find("#question-result-incorrect").exists()).toBe(false)
    expect(testMCQ.find("#question-result-correct").exists()).toBe(false)
    expect(testMCQ.find("#question-result-unmarked").exists()).toBe(true)
})

it('Transforms submit button into continue button after correct answer', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-d").simulate("click")
    let markButton = testMCQ.find("#submit-for-marking-button")
    markButton.simulate("click")

    expect(testMCQ.find("#submit-for-marking-button").exists()).toBe(false)
    expect(testMCQ.find("#continue-button").exists()).toBe(true)
})

it('Calls the onCorrect completion handler when question answered correctly', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let questionCompletedCorrectly = jest.fn()
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onCorrect={questionCompletedCorrectly} />)

    testMCQ.find("#choice-d").simulate("click")
    testMCQ.find("#submit-for-marking-button").simulate("click")
    testMCQ.find("#continue-button").simulate("click")

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Calls the onIncorrect completion handler when question answered incorrectly', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let questionCompletedIncorrectly = jest.fn()
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onIncorrect={questionCompletedIncorrectly} />)

    testMCQ.find("#choice-b").simulate("click")
    testMCQ.find("#submit-for-marking-button").simulate("click")
    testMCQ.find("#continue-button").simulate("click")

    expect(questionCompletedIncorrectly).toHaveBeenCalled()
})

it('Shows the correction for after answering incorrectly', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onIncorrect={() => {}} />)

    testMCQ.find("#choice-b").simulate("click")
    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#choice-d").is(".choice-correction")).toBe(true)
})

it('Clicking checkboxes after marking doesnt change the active choice', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: Choices.D}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onIncorrect={() => {}} />)

    testMCQ.find("#choice-b").simulate("click")
    testMCQ.find("#submit-for-marking-button").simulate("click")
    testMCQ.find("#choice-a").simulate("click")

    expect(testMCQ.state("activeChoice")).toEqual(Choices.B)
})