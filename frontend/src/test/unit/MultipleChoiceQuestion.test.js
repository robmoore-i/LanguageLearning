// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import MultipleChoiceQuestion, {rmExcessChoices} from '../../main/MultipleChoiceQuestion'
import Mark from "../../main/Mark"
// Enzyme react-adapter configuration & others
import {configureAdapter, doNothing, questionSubmitAndContinue} from "../utils"

configureAdapter()

it('Shows the question of a translation question', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#question").text()).toBe("Which of these sounds like \"i\" in English?")
})

it('Shows the four choices', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#choiceValue-a").text()).toBe("ა")
    expect(testMCQ.find("#choiceValue-b").text()).toBe("ო")
    expect(testMCQ.find("#choiceValue-c").text()).toBe("უ")
    expect(testMCQ.find("#choiceValue-d").text()).toBe("ი")
})

it('Can select a choice', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-a").simulate("click")

    expect(testMCQ.find("#choicebox-a").props().checked).toBe(true)
})

it('Can select only one choice at a time', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-a").simulate("click")
    testMCQ.find("#choice-b").simulate("click")

    expect(testMCQ.find("#choicebox-a").props().checked).toBe(false)
    expect(testMCQ.find("#choicebox-b").props().checked).toBe(true)
})

it('Marks a correct answer as correct', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-d").simulate("click")

    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#question-result-correct").exists()).toBe(true)
})

it('Marks an incorrect answer as incorrect', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-c").simulate("click")

    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#question-result-incorrect").exists()).toBe(true)
    expect(testMCQ.find("#question-result-correct").exists()).toBe(false)
})

it('Doesnt mark if no answer is given', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#question-result-incorrect").exists()).toBe(false)
    expect(testMCQ.find("#question-result-correct").exists()).toBe(false)
    expect(testMCQ.find("#question-result-unmarked").exists()).toBe(true)
})

it('Transforms submit button into continue button after correct answer', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-d").simulate("click")

    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#submit-for-marking-button").exists()).toBe(false)
    expect(testMCQ.find("#continue-button").exists()).toBe(true)
})

it('Calls the onCorrect completion handler when question answered correctly', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let questionCompletedCorrectly = jest.fn()
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onCorrect={questionCompletedCorrectly} />)

    testMCQ.find("#choice-d").simulate("click")
    questionSubmitAndContinue(testMCQ)

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Calls the onIncorrect completion handler when question answered incorrectly', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let questionCompletedIncorrectly = jest.fn()
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onIncorrect={questionCompletedIncorrectly} />)

    testMCQ.find("#choice-b").simulate("click")
    questionSubmitAndContinue(testMCQ)

    expect(questionCompletedIncorrectly).toHaveBeenCalled()
})

it('Shows the correction for after answering incorrectly', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onIncorrect={doNothing}/>)

    testMCQ.find("#choice-b").simulate("click")
    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#choice-d").is(".choice-correction")).toBe(true)
})

it('Clicking checkboxes after marking doesnt change the active choice', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onIncorrect={doNothing}/>)

    testMCQ.find("#choice-b").simulate("click")
    questionSubmitAndContinue(testMCQ)

    expect(testMCQ.state("activeChoice")).toEqual("b")
})

it('An incorrect answer changes class after marking', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-c").simulate("click")

    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#choice-c").is(".choice-marked-incorrect")).toBe(true)
})

it('Can select choices using ABCD', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    window.onkeydown({key: "a"})
    testMCQ.update()
    expect(testMCQ.state("activeChoice")).toEqual("a")
})

it('Can select choices using 1234', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    window.onkeydown({key: "2"})
    testMCQ.update()
    expect(testMCQ.state("activeChoice")).toEqual("b")
})

it('Can submit choice for marking using enter', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-c").simulate("click")

    window.onkeydown({key: "Enter"})

    expect(testMCQ.state("markResult")).toEqual(Mark.INCORRECT)
})

it('Can press continue button using enter', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let questionCompletedCorrectly = jest.fn()
    let testMCQ = mount(<MultipleChoiceQuestion q={q} onCorrect={questionCompletedCorrectly} />)

    testMCQ.find("#choice-d").simulate("click")

    window.onkeydown({key: "Enter"})
    window.onkeydown({key: "Enter"})

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Shows three choices if there are only three', () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", answer: "c"}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#choiceValue-a").text()).toBe("ა")
    expect(testMCQ.find("#choiceValue-b").text()).toBe("ო")
    expect(testMCQ.find("#choiceValue-c").text()).toBe("უ")
    expect(testMCQ.find("#choiceValue-d").exists()).toBe(false)
})

it('Shows five choices if there are five', () => {
    let q = {type: 1, index: 0, question: "sounds like \"s\" in English", a: "ა", b: "ო", c: "უ", d: "ხ", e: "ს", answer: "e"}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#choiceValue-a").text()).toBe("ა")
    expect(testMCQ.find("#choiceValue-b").text()).toBe("ო")
    expect(testMCQ.find("#choiceValue-c").text()).toBe("უ")
    expect(testMCQ.find("#choiceValue-d").text()).toBe("ხ")
    expect(testMCQ.find("#choiceValue-e").text()).toBe("ს")
})

it('Can remove excess choices from an MCQ object', () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", d: "!", answer: "c"}
    expect(Object.keys(rmExcessChoices(q))).not.toContain("d")
})

it('Removing excess choices from an MCQ object leaves the others intact', () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", d: "!", answer: "c"}
    let newMCQ = rmExcessChoices(q)
    expect(newMCQ.type).toEqual(q.type)
    expect(newMCQ.question).toEqual(q.question)
    expect(newMCQ.answer).toEqual(q.answer)
    expect(newMCQ.a).toEqual(q.a)
    expect(newMCQ.b).toEqual(q.b)
    expect(newMCQ.c).toEqual(q.c)
})

it("Can't deselect choice on a 3-choice MCQ by using number keys greater than 3", () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", answer: "c"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    window.onkeydown({key: "1"})
    testMCQ.update()
    window.onkeydown({key: "4"})
    testMCQ.update()
    expect(testMCQ.state("activeChoice")).toEqual("a")
})

it("Can select choice d/4 on a 4-choice MCQ using the '4' key", () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "c"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    window.onkeydown({key: "1"})
    testMCQ.update()
    window.onkeydown({key: "4"})
    testMCQ.update()
    expect(testMCQ.state("activeChoice")).toEqual("d")
})

it("Can answer a 5-choice MCQ", () => {
    let q = {type: 1, index: 0, question: "sounds like \"v\" in English", a: "ა", b: "ო", c: "უ", d: "ი", e: "ვ", answer: "e"}
    let testMCQ = mount(<MultipleChoiceQuestion q={q} />)

    testMCQ.find("#choice-e").simulate("click")
    testMCQ.find("#submit-for-marking-button").simulate("click")

    expect(testMCQ.find("#question-result-correct").exists()).toBe(true)
    expect(testMCQ.find("#question-result-incorrect").exists()).toBe(false)
})
