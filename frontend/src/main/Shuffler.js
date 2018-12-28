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
            let temp = tq.given
            shuffledTQ.given = tq.answer
            shuffledTQ.answer = temp
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
    shuffleChoices: (mcq) => mcq
}

export const defaultShuffler = Shuffler()
