// React
import React from 'react'
// Testing
import {shallow} from 'enzyme'
// Main
import Question from '../main/Question'
// Enzyme react-adapter configuration & others
import {configureAdapter} from "./utils"

configureAdapter()

describe('Translation questions', () => {
    it('Shows the question of a translation question', () => {
        let q = {type: 0, given: "hello", answer: "გამარჯობა"}
        let testTQ = shallow(<Question q={q} />)

        let questionTitle = testTQ.find("#question-title").first()

        expect(questionTitle.text()).toBe("Translate \"hello\"")
    })
})