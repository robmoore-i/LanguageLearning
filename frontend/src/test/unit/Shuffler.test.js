// React
import React from 'react'

// Main
import {Shuffler} from "../../main/Shuffler"
import {randomChoice} from '../../main/random.js'

function assertGeneratedMCQIsValid(mcq) {
    expect(mcq[mcq.answer]).toEqual("YES")
}

it('Shuffles 4-question MCQs consistently', () => {
    let shuffler = Shuffler()

    function generateMCQ4() {
        let fourPossibleConfigurations = [
            {type: 1, question: "says 'YES'", a: "YES", b: "NO-1", c: "NO-2", d: "NO-3", answer: "a"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "YES", c: "NO-2", d: "NO-3", answer: "b"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "YES", d: "NO-3", answer: "c"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "NO-3", d: "YES", answer: "d"}
        ]

        return randomChoice(fourPossibleConfigurations)
    }

    for (var i = 0; i < 50; i++) {
        let mcq = generateMCQ4()
        let shuffledMCQ = shuffler.shuffleChoices(mcq)
        assertGeneratedMCQIsValid(shuffledMCQ)
    }
})

it('Shuffles single answer TQs consistently', () => {
    let shuffler = Shuffler()
    let tq = {type: 0, given: "A", answer: "B"}

    for (var i = 0; i < 50; i++) {
        let shuffledTQ = shuffler.shuffleTranslation(tq)

    }
})

it("Doesn't shuffle multiple answer TQs", () => {
    let shuffler = Shuffler()
    let tq = {type: 0, given: "A", answers: ["B", "C", "D", "E", "F"]}

    for (var i = 0; i < 50; i++) {
        let shuffledTQ = shuffler.shuffleTranslation(tq)
        expect(shuffledTQ.given).toEqual("A")
        expect(shuffledTQ.answer).toEqual("B")
        expect(shuffledTQ.answers).toContain("B")
        expect(shuffledTQ.answers).toContain("C")
        expect(shuffledTQ.answers).toContain("D")
        expect(shuffledTQ.answers).toContain("E")
        expect(shuffledTQ.answers).toContain("F")
    }
})
