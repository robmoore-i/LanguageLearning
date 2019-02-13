// React
import React from 'react'
// Main
import {Shuffler} from "../../main/Shuffler"
import {randomChoice} from '../../main/random.js'
import {lowercaseAlphabet} from "../../main/Choices";

function assertGeneratedMCQIsValid(mcq, nChoices) {
    expect(mcq[mcq.answer]).toEqual("YES")
    let alphabet = lowercaseAlphabet
    let mcqKeys = Object.keys(mcq)
    for (let i = 0; i < nChoices; i++) {
        expect(mcqKeys).toContain(alphabet[i])
    }
    for (let i = nChoices; i < 6; i++) {
        expect(mcqKeys).not.toContain(alphabet[i])
    }
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
        assertGeneratedMCQIsValid(shuffledMCQ, 4)
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

it('Shuffles 3-question MCQs consistently', () => {
    let shuffler = Shuffler()

    function generateMCQ3() {
        let threePossibleConfigurations = [
            {type: 1, question: "says 'YES'", a: "YES", b: "NO-1", c: "NO-2", answer: "a"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "YES", c: "NO-2", answer: "b"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "YES", answer: "c"}
        ]

        return randomChoice(threePossibleConfigurations)
    }

    for (var i = 0; i < 50; i++) {
        let mcq = generateMCQ3()
        let shuffledMCQ = shuffler.shuffleChoices(mcq)
        assertGeneratedMCQIsValid(shuffledMCQ, 3)
    }
})

it('Shuffles 6-question MCQs consistently', () => {
    let shuffler = Shuffler()

    function generateMCQ6() {
        let sixPossibleConfigurations = [
            {type: 1, question: "says 'YES'", a: "YES",  b: "NO-1", c: "NO-2", d: "NO-3", e: "NO-4", f: "NO-5", answer: "a"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "YES",  c: "NO-2", d: "NO-3", e: "NO-4", f: "NO-5", answer: "b"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "YES",  d: "NO-3", e: "NO-4", f: "NO-5", answer: "c"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "NO-3", d: "YES",  e: "NO-4", f: "NO-5", answer: "d"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "NO-3", d: "NO-4", e: "YES",  f: "NO-5", answer: "e"},
            {type: 1, question: "says 'YES'", a: "NO-1", b: "NO-2", c: "NO-3", d: "NO-4", e: "NO-5", f: "YES",  answer: "f"}
        ]

        return randomChoice(sixPossibleConfigurations)
    }

    for (var i = 0; i < 50; i++) {
        let mcq = generateMCQ6()
        let shuffledMCQ = shuffler.shuffleChoices(mcq)
        assertGeneratedMCQIsValid(shuffledMCQ, 6)
    }
})
