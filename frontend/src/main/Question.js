// React
import React from "react"

// Resources
import '../styles/Question.css'

export function submitForMarkingButton(setMark) {
    return (
        <span id="submit-for-marking-button" className="mark-continue-button" key="submit-for-marking-button"
           onClick={setMark}>
           Mark
        </span>
    )
}

function _continueButton(completionListener, enabled) {
    let className = enabled ? "mark-continue-button" : "mark-continue-button-disabled"
    return (
        <span id="continue-button" className={className} key="continue-button"
           onClick={() => {
               completionListener()
           }}>
           Continue
        </span>
    )
}

export function continueButton(completionListener) {
    return _continueButton(completionListener, true)
}

export const disabledContinueButton = _continueButton(() => {}, false)

export const QuestionTypes = {
    TRANSLATION: 0,
    MULTIPLE_CHOICE: 1,
    READING: 2
}

export function formatAnswer(rawAnswer) {
    return rawAnswer.replace(/\s+/g,' ').trim().toLowerCase().replace(/[?!.,]/g, "")
}
