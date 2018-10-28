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

    expect(testRQ.find("#question-given-0").text()).toBe("Where did Vlad go?")
    expect(testRQ.find("#question-given-1").text()).toBe("What did he get there?")
})

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

    expect(testRQ.find("#question-result-correct-0").exists()).toBe(true)
    expect(testRQ.find("#question-result-correct-1").exists()).toBe(true)
})