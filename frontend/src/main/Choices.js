import {randomChoice, randomCharChoice} from './random'
import {isLowercaseLetter, isOneDigitNumber} from './string'

export function Choices(nChoices) {
    let capitalAlphabet = "ABCD"
    let o = {}
    let choiceEnumValues = []
    for (var i = 0; i < nChoices; i++) {
        let choiceCapitalLetter = capitalAlphabet.charAt(i)
        let choiceValue = choiceCapitalLetter.toLowerCase()
        o[choiceCapitalLetter] = choiceValue
        choiceEnumValues.push(choiceValue)
    }
    let NONE = "!"
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
        } else {
            return NONE
        }
    }
    o.fromKey = fromKey
    o.isChoiceKey = (k) => fromKey(k) != NONE
    return o
}

export function randomMultipleQuestionChoice(n) {
    return randomCharChoice("abcdef".substring(0, n))
}
