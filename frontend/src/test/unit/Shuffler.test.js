// React
import React from 'react'


// Main
import {Shuffler} from "../../main/Shuffler"
import {Choices} from '../../main/MultipleChoiceQuestion'
import {randomChoice} from '../../main/random.js'

function generateMCQ() {
    let fourPossibleConfigurations = [
        {type: 1, question: "says 'YES'", a: "YES", b: "NO-1", c: "NO-2", d: "NO-3", answer: Choices.A},
        {type: 1, question: "says 'YES'", a: "NO-1", b: "YES", c: "NO-2", d: "NO-3", answer: Choices.B},
        {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "YES", d: "NO-3", answer: Choices.C},
        {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "NO-3", d: "YES", answer: Choices.D}
    ]

    return randomChoice(fourPossibleConfigurations)
}

function assertGeneratedMCQIsValid(mcq) {
    expect(mcq[mcq.answer]).toEqual("YES")
}

it('Shuffled MCQ is consistent', () => {
    let shuffler = Shuffler()

    for (var i = 0; i < 50; i++) {
        let q = generateMCQ()
        let shuffledQ = shuffler.shuffleChoices(q)
        assertGeneratedMCQIsValid(shuffledQ)
    }
})
