import {Choices} from './MultipleChoiceQuestion'

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

    return {
        shuffleChoices: shuffleChoices
    }
}

export const nonShuffler = {
    shuffleChoices: (mcq) => mcq
}

export const defaultShuffler = Shuffler()
