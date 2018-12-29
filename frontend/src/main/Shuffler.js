import {Choices} from './MultipleChoiceQuestion'
import {coinFlip} from './random'

export function Shuffler() {
    function shuffleChoices(mcq) {
        let selectedNewAnswer = Choices.random()
        let currentAnswer = mcq.answer
        let answerValue = mcq[currentAnswer]
        let answerToBeReplacedByRealAnswer = mcq[selectedNewAnswer]
        let shuffledQ = mcq
        shuffledQ[selectedNewAnswer] = answerValue
        shuffledQ.answer = selectedNewAnswer
        shuffledQ[currentAnswer] = answerToBeReplacedByRealAnswer
        return shuffledQ
    }

    function shuffleTranslation(tq) {
        let flipTranslation = coinFlip()
        if (flipTranslation) {
            let shuffledTQ = tq
            let newAnswer = tq.given
            let newGiven = tq.answer ? tq.answer : tq.answers[0]
            shuffledTQ.given = newGiven
            shuffledTQ.answer = newAnswer
            return shuffledTQ
        } else {
            return tq
        }
    }

    return {
        shuffleChoices: shuffleChoices,
        shuffleTranslation: shuffleTranslation
    }
}

export const nonShuffler = {
    shuffleChoices: (mcq) => mcq,
    shuffleTranslation: (tq) => tq
}

export const defaultShuffler = Shuffler()
