// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import MultipleChoiceQuestion from '../main/MultipleChoiceQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter} from "./utils"

configureAdapter()

it('Shows the question of a translation question', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#question-title").text()).toBe("Which of these sounds like \"i\" in English?")
})

it('Shows the four choices', () => {
    let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let testMCQ = shallow(<MultipleChoiceQuestion q={q} />)

    expect(testMCQ.find("#choice-a").text()).toBe("ა")
    expect(testMCQ.find("#choice-b").text()).toBe("ო")
    expect(testMCQ.find("#choice-c").text()).toBe("უ")
    expect(testMCQ.find("#choice-d").text()).toBe("ი")
})

// it('Cannot check both choices A and B', () => {
//     let q = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
//     let testMCQ = mount(<MultipleChoiceQuestion q={q} />)
//
//     testMCQ.find("#choicebox-a").simulate("click")
//     testMCQ.find("#choicebox-b").simulate("click")
//
//     expect(testMCQ.find("#choicebox-a").props().checked).toBe(false)
//     expect(testMCQ.find("#choicebox-b").props().checked).toBe(true)
// })