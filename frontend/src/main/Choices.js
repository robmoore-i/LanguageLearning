import {randomCharChoice, randomChoice} from './random'
import {isLowercaseLetter, isOneDigitNumber} from './string'

export function Choices(nChoices) {
    let capitalAlphabet = "ABCDEF"
    let NONE = "!"
    let o = {}
    let choiceEnumValues = []

    for (var i = 0; i < nChoices; i++) {
        let choiceCapitalLetter = capitalAlphabet.charAt(i)
        let choiceValue = choiceCapitalLetter.toLowerCase()
        o[choiceCapitalLetter] = choiceValue
        choiceEnumValues.push(choiceValue)
    }

    o.NONE = NONE
    o.random = () => randomChoice(choiceEnumValues)
    o.fromInt = (i) => choiceEnumValues[i]

    let fromKey = (k) => {
        if (isLowercaseLetter(k) && choiceEnumValues.includes(k)) {
            return k
        } else if (isOneDigitNumber(k)) {
            let indexOneBased = parseInt(k)
            if (indexOneBased <= nChoices) {
                return choiceEnumValues[indexOneBased - 1]
            }
        }
        return NONE
    }

    o.fromKey = fromKey
    o.isChoiceKey = (k) => fromKey(k) !== NONE
    o.forEach = (f) => {
        for (let i = 0; i < nChoices; i++) {
            f(choiceEnumValues[i])
        }
    }
    return o
}

export function randomMultipleQuestionChoice(n) {
    return randomCharChoice("abcdef".substring(0, n))
}
