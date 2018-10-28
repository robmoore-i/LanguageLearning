// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import ReadingQuestion from '../../main/ReadingQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter, textBoxInputEvent} from "../utils"

configureAdapter()

it('Shows the source', () => {
    let q = {
        type: 2,
        source: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
            ]
    }
    let testRQ = shallow(<ReadingQuestion q={q} />)

    expect(testRQ.find("#question-source").text()).toBe("Vlad went to the kitchen and got some cake")
})

it('Shows all the questions', () => {
    let q = {
        type: 2,
        source: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
        ]
    }
    let testRQ = shallow(<ReadingQuestion q={q} />)

    expect(testRQ.find("#posed-question-0").dive().find("#question-given-0").text()).toBe("Where did Vlad go?")
    expect(testRQ.find("#posed-question-1").dive().find("#question-given-1").text()).toBe("What did he get there?")
})

// Asserts that the (i)th posed question in the reading question(rq) is correct
let assertCorrect = (rq, i) => {
    expect(rq.find("#question-result-correct-" + i).exists()).toBe(true)
    expect(rq.find("#question-result-incorrect-" + i).exists()).toBe(false)
    expect(rq.find("#question-result-unmarked-" + i).exists()).toBe(false)
}

// Asserts that the (i)th posed question in the reading question(rq) is incorrect
let assertIncorrect = (rq, i) => {
    expect(rq.find("#question-result-correct-" + i).exists()).toBe(false)
    expect(rq.find("#question-result-incorrect-" + i).exists()).toBe(true)
    expect(rq.find("#question-result-unmarked-" + i).exists()).toBe(false)
}

it('Marks correct answers as correct', () => {
    let q = {
        type: 2,
        source: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Kitchen"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    assertCorrect(testRQ, 0)
    assertCorrect(testRQ, 1)
})

it('Marks incorrect answers as incorrect', () => {
    let q = {
        type: 2,
        source: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Ayy"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Lmao"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    assertIncorrect(testRQ, 0)
    assertIncorrect(testRQ, 1)
})

it('Marks questions separately', () => {
    let q = {
        type: 2,
        source: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"},
            {given: "What's this guy's name again?", answer: "Vlad"},
            {given: "What even is a kitchen?", answer: "A type of room"},
            {given: "And who are you?", answer: "A reading question, dummy"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
    testRQ.find("#answer-input-textbox-2").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#answer-input-textbox-3").simulate("change", textBoxInputEvent("A type of room"))
    testRQ.find("#answer-input-textbox-4").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    assertIncorrect(testRQ, 0)
    assertCorrect(testRQ, 1)
    assertIncorrect(testRQ, 2)
    assertCorrect(testRQ, 3)
    assertIncorrect(testRQ, 4)
})
