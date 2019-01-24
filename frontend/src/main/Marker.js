import Mark from "./Mark"
import {formatAnswer} from "./Question"

export function Marker() {
    function compareFormattedAnswers(formattedActual, formattedExpected) {
        if (formattedActual === "") {
            return Mark.UNMARKED
        } else if (formattedActual === formattedExpected) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    function markAgainstAnswerList(formattedSubmittedAnswer, correctAnswerList) {
        let formattedExpecteds = correctAnswerList.map(formatAnswer)
        let isCorrect = (formattedExpected) => compareFormattedAnswers(formattedSubmittedAnswer, formattedExpected) === Mark.CORRECT
        let matchesFormattedExpecteds = formattedExpecteds.map(isCorrect)
        let matchesAnyExpected = matchesFormattedExpecteds.reduce((cur, acc) => cur || acc)
        if (matchesAnyExpected) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    function mark(question, submittedAnswer) {
        let formattedSubmission = formatAnswer(submittedAnswer)
        if ("answers" in question) {
            return markAgainstAnswerList(formattedSubmission, question.answers)
        } else {
            let formattedExpected = formatAnswer(question.answer)
            return compareFormattedAnswers(formattedSubmission, formattedExpected)
        }
    }

    return {
        mark: mark
    }
}
