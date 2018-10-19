// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/TranslationQuestion.css'
// Main
import Mark from "./Mark"
import {submitForMarkingButton, continueButton} from "./Question"

export default class TranslationQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            markResult: Mark.UNMARKED,
            currentAnswer: ""
        }
    }

    mark(answer) {
        if (answer === "") {
            return Mark.UNMARKED
        } else if (answer === this.props.q.answer) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    submitForMarkingButton() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.
        const markResult = this.mark(this.state.currentAnswer)
        let setMark = () => {setState({markResult: markResult})}
        return submitForMarkingButton(setMark)
    }

    button() {
        if (this.state.markResult === Mark.UNMARKED) {
            return this.submitForMarkingButton()
        } else {
            return continueButton(this.props.completionListener)
        }
    }

    render() {
        return [
            <br key="header--break--question-title"/>,
            <div id="question-title" key="question-title">
                <span id="question-title-instruction">What is the translation of</span>
                <span id="question-title-given">{this.props.q.given}</span>
                <span id={this.state.markResult.id}>
                    <img src={this.state.markResult.img} className="question-result" alt="mark-result-status" />
                </span>
            </div>,
            <br key="question-title--break--textarea"/>,
            <textarea id="answer-input-textbox" rows="5" cols="50" key="answer-input-textbox"
                   onChange={(event) => {
                       this.setState({currentAnswer: event.target.value})
                    }}/>,
            <div key="textarea--break--submit-button">
                <br />
            </div>,
            this.button()
        ]
    }
}