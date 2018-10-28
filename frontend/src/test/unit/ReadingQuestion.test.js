// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import ReadingQuestion from '../../main/ReadingQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter} from "../utils"

configureAdapter()

it('Shows the source in a reading question', () => {
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