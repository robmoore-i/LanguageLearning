import {randomChoice} from './random'
import {isLowercaseLetter, isOneDigitNumber} from './string'

export const ChoicesClass = {
    init: (nChoices) => {
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
    },

    random: (n) => randomChoice(["a", "b", "c", "d"])
}

export const Choices = ChoicesClass.init(4)
