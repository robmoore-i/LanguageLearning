// React
import React from "react"

// Resources
import '../styles/Question.css'

//Main
import Mark from "./Mark"

export function submitForMarkingButton(onClick) {
    return (
        <a id="submit-for-marking-button" className="mark-continue-button" key="submit-for-marking-button"
           onClick={onClick}>
           Mark
        </a>
    )
}

export function continueButton(completionListener) {
    return (
        <a id="continue-button" className="mark-continue-button" key="continue-button"
           onClick={() => {
               completionListener()
           }}>
            Continue
        </a>
    )
}