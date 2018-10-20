// React
import React from "react"

// Resources
import '../styles/Question.css'

export function submitForMarkingButton(setMark) {
    return (
        <a id="submit-for-marking-button" className="mark-continue-button" key="submit-for-marking-button"
           onClick={setMark}>
           Mark
        </a>
    )
}

export function continueButton(completionListener, enabled) {
    let className = enabled ? "mark-continue-button" : "mark-continue-button-disabled"
    return (
        <a id="continue-button" className={className} key="continue-button"
           onClick={completionListener}>
           Continue
        </a>
    )
}

export const QuestionTypes = {
    TRANSLATION: 0,
    MULTIPLE_CHOICE: 1
}