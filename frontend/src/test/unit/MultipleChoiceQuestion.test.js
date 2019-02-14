// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import MultipleChoiceQuestion, {rmExcessChoices} from '../../main/MultipleChoiceQuestion'
import Mark from "../../main/Mark"
// Enzyme react-adapter configuration & others
import {configureAdapter, doNothing, questionSubmitAndContinue, stubAnalytics} from "../utils"

configureAdapter()


function shallowMcq(q) {
    return shallow(<MultipleChoiceQuestion q={q} analytics={stubAnalytics}/>)
}

function mountMcq(q) {
    return mount(<MultipleChoiceQuestion q={q} analytics={stubAnalytics}/>)
}

function pressKey(mcqComponent, key) {
    window.onkeydown({key: key})
    mcqComponent.update()
}

function clickChoice(mcqComponent, choiceLetter) {
    mcqComponent.find("#choice-" + choiceLetter).simulate("click")
}

function submitForMarking(mcqComponent) {
    mcqComponent.find("#submit-for-marking-button").simulate("click")
}

it('Shows the question of a translation question', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = shallowMcq(q)

    expect(mcq.find("#question").text()).toBe("Which of these sounds like \"i\" in English?")
})

it('Shows the four choices', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = shallowMcq(q)

    expect(mcq.find("#choiceValue-a").text()).toBe("ა")
    expect(mcq.find("#choiceValue-b").text()).toBe("ო")
    expect(mcq.find("#choiceValue-c").text()).toBe("უ")
    expect(mcq.find("#choiceValue-d").text()).toBe("ი")
})

it('Can select a choice', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "a")

    expect(mcq.find("#choicebox-a").props().checked).toBe(true)
})

it('Can select only one choice at a time', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "a")
    clickChoice(mcq, "b")

    expect(mcq.find("#choicebox-a").props().checked).toBe(false)
    expect(mcq.find("#choicebox-b").props().checked).toBe(true)
})

it('Marks a correct answer as correct', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "d")

    submitForMarking(mcq)

    expect(mcq.find("#question-result-correct").exists()).toBe(true)
})

it('Marks an incorrect answer as incorrect', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "c")

    submitForMarking(mcq)

    expect(mcq.find("#question-result-incorrect").exists()).toBe(true)
    expect(mcq.find("#question-result-correct").exists()).toBe(false)
})

it('Doesnt mark if no answer is given', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    submitForMarking(mcq)

    expect(mcq.find("#question-result-incorrect").exists()).toBe(false)
    expect(mcq.find("#question-result-correct").exists()).toBe(false)
    expect(mcq.find("#question-result-unmarked").exists()).toBe(true)
})

it('Transforms submit button into continue button after correct answer', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "d")

    submitForMarking(mcq)

    expect(mcq.find("#submit-for-marking-button").exists()).toBe(false)
    expect(mcq.find("#continue-button").exists()).toBe(true)
})

it('Calls the onCorrect completion handler when question answered correctly', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let questionCompletedCorrectly = jest.fn()
    let mcq = mount(<MultipleChoiceQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    clickChoice(mcq, "d")
    questionSubmitAndContinue(mcq)

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Calls the onIncorrect completion handler when question answered incorrectly', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let questionCompletedIncorrectly = jest.fn()
    let mcq = mount(<MultipleChoiceQuestion q={q} onIncorrect={questionCompletedIncorrectly}
                                            analytics={stubAnalytics}/>)

    clickChoice(mcq, "b")
    questionSubmitAndContinue(mcq)

    expect(questionCompletedIncorrectly).toHaveBeenCalled()
})

it('Shows the correction for after answering incorrectly', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mount(<MultipleChoiceQuestion q={q} onIncorrect={doNothing} analytics={stubAnalytics}/>)

    clickChoice(mcq, "b")
    submitForMarking(mcq)

    expect(mcq.find("#choice-d").is(".choice-correction")).toBe(true)
})

it('Clicking checkboxes after marking doesnt change the active choice', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mount(<MultipleChoiceQuestion q={q} onIncorrect={doNothing} analytics={stubAnalytics}/>)

    clickChoice(mcq, "b")
    questionSubmitAndContinue(mcq)

    expect(mcq.state("activeChoice")).toEqual("b")
})

it('An incorrect answer changes class after marking', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "c")
    submitForMarking(mcq)

    expect(mcq.find("#choice-c").is(".choice-marked-incorrect")).toBe(true)
})

it('Can select choices using ABCD', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    pressKey(mcq, "a")

    expect(mcq.state("activeChoice")).toEqual("a")
})

it('Can select choices using 1234', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    pressKey(mcq, "2")

    expect(mcq.state("activeChoice")).toEqual("b")
})

it('Can submit choice for marking using enter', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "c")

    pressKey(mcq, "Enter")

    expect(mcq.state("markResult")).toEqual(Mark.INCORRECT)
})

it('Can press continue button using enter', () => {
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let questionCompletedCorrectly = jest.fn()
    let mcq = mount(<MultipleChoiceQuestion q={q} onCorrect={questionCompletedCorrectly} analytics={stubAnalytics}/>)

    clickChoice(mcq, "d")

    pressKey(mcq, "Enter")
    pressKey(mcq, "Enter")

    expect(questionCompletedCorrectly).toHaveBeenCalled()
})

it('Shows three choices if there are only three', () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", answer: "c"}
    let mcq = shallowMcq(q)

    expect(mcq.find("#choiceValue-a").text()).toBe("ა")
    expect(mcq.find("#choiceValue-b").text()).toBe("ო")
    expect(mcq.find("#choiceValue-c").text()).toBe("უ")
    expect(mcq.find("#choiceValue-d").exists()).toBe(false)
})

it('Shows five choices if there are five', () => {
    let q = {type: 1, index: 0, question: "sounds like \"s\" in English", a: "ა", b: "ო", c: "უ", d: "ხ", e: "ს", answer: "e"}
    let mcq = shallowMcq(q)

    expect(mcq.find("#choiceValue-a").text()).toBe("ა")
    expect(mcq.find("#choiceValue-b").text()).toBe("ო")
    expect(mcq.find("#choiceValue-c").text()).toBe("უ")
    expect(mcq.find("#choiceValue-d").text()).toBe("ხ")
    expect(mcq.find("#choiceValue-e").text()).toBe("ს")
})

it('Can remove excess choices from an MCQ object', () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", d: "!", answer: "c"}
    expect(Object.keys(rmExcessChoices(q))).not.toContain("d")
})

it('Removing excess choices from an MCQ object leaves the others intact', () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", d: "!", answer: "c"}
    let newQ = rmExcessChoices(q)
    expect(newQ.type).toEqual(q.type)
    expect(newQ.question).toEqual(q.question)
    expect(newQ.answer).toEqual(q.answer)
    expect(newQ.a).toEqual(q.a)
    expect(newQ.b).toEqual(q.b)
    expect(newQ.c).toEqual(q.c)
})

it("Can't deselect choice on a 3-choice MCQ by using number keys greater than 3", () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", answer: "c"}
    let mcq = mountMcq(q)

    pressKey(mcq, "1")
    pressKey(mcq, "4")

    expect(mcq.state("activeChoice")).toEqual("a")
})

it("Can select choice d/4 on a 4-choice MCQ using the '4' key", () => {
    let q = {type: 1, index: 0, question: "sounds like \"u\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "c"}
    let mcq = mountMcq(q)

    pressKey(mcq, "1")
    pressKey(mcq, "4")

    expect(mcq.state("activeChoice")).toEqual("d")
})

it("Can answer a 5-choice MCQ", () => {
    let q = {type: 1, index: 0, question: "sounds like \"v\" in English", a: "ა", b: "ო", c: "უ", d: "ი", e: "ვ", answer: "e"}
    let mcq = mountMcq(q)

    clickChoice(mcq, "e")
    submitForMarking(mcq)

    expect(mcq.find("#question-result-correct").exists()).toBe(true)
    expect(mcq.find("#question-result-incorrect").exists()).toBe(false)
})

it("Sends analytics message when a choice checkbox is clicked", () => {
    let analytics = {recordEvent: jest.fn()}
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mount(<MultipleChoiceQuestion q={q} analytics={analytics}/>)

    clickChoice(mcq, "a")

    expect(analytics.recordEvent).toHaveBeenCalledWith("select@choice-a&click#multiplechoicequestion-sounds like \"i\" in English-|ა|ო|უ|ი|")
})

it("Sends analytics message with the choices listed when a choice checkbox is clicked", () => {
    let analytics = {recordEvent: jest.fn()}
    let q = {type: 1, index: 0, question: "some question", a: "xyz", b: "abc", c: "123", d: "do re mi", answer: "d"}
    let mcq = mount(<MultipleChoiceQuestion q={q} analytics={analytics}/>)

    clickChoice(mcq, "c")

    expect(analytics.recordEvent).toHaveBeenCalledWith("select@choice-c&click#multiplechoicequestion-some question-|xyz|abc|123|do re mi|")
})

it("Sends analytics message when a choice is selected by keyboard", () => {
    let analytics = {recordEvent: jest.fn()}
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mount(<MultipleChoiceQuestion q={q} analytics={analytics}/>)

    pressKey(mcq, "3")

    expect(analytics.recordEvent).toHaveBeenCalledWith("select@choice-c&keypress-3#multiplechoicequestion-sounds like \"i\" in English-|ა|ო|უ|ი|")
})

it("Sends analytics message when correct answer submitted", () => {
    let analytics = {recordEvent: jest.fn()}
    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mount(<MultipleChoiceQuestion q={q} analytics={analytics}/>)

    clickChoice(mcq, "d")
    submitForMarking(mcq)

    expect(analytics.recordEvent).toHaveBeenCalledWith("click@submit-for-marking-button&correct#multiplechoicequestion-sounds like \"i\" in English-|ა|ო|უ|ი|")
})

it("Sends analytics message when incorrect answer submitted", () => {
    let analytics = {recordEvent: jest.fn()}

    let q = {type: 1, index: 0, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let mcq = mount(<MultipleChoiceQuestion q={q} analytics={analytics}/>)

    clickChoice(mcq, "a")
    submitForMarking(mcq)

    expect(analytics.recordEvent).toHaveBeenCalledWith("click@submit-for-marking-button&incorrect#multiplechoicequestion-sounds like \"i\" in English-|ა|ო|უ|ი|")
})