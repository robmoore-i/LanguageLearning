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
            currentAnswer: "",
            transitionState: TransitionState.UNMARKED
        }
    }

    render() {
        return [
            <br key="lesson-header--break--question-title"/>,

            this.questionHeader(),

            <br key="question-title--break--textarea"/>,

            this.answerInputTextBox(),

            <div key="textarea--break--submit-button">
                <br />
            </div>,

            this.button()
        ]
    }

    questionHeader() {
        let prompt = this.inCorrectingState() ? this.correctionPrompt() : null
        return (
            <div id="question-header" key="question-header">
                <span id="question-instruction">What is the translation of</span>
                <span id="question-given">{this.props.q.given}</span>
                <span id={this.markResult().id}>
                    <img src={this.markResult().img} className="question-result" alt="mark-result-status" />
                </span>
                {prompt}
            </div>
        )
    }

    inCorrectingState() {
        let correctingStates = [TransitionState.INCORRECT, TransitionState.CORRECTED]
        return correctingStates.includes(this.state.transitionState)
    }

    correctionPrompt() {
        return [
            <div key="question-title--break--correction-prompt">
                <br />
            </div>,
            <div key="correction-prompt">
                <span id="correction-prompt">Type out the correct answer</span>
                <span id="correction-answer">{this.props.q.answer}</span>
            </div>
        ]
    }

    markResult() {
        let numStates = Object.keys(TransitionState).length
        let mapping = Array(numStates)

        mapping[TransitionState.UNMARKED]  = Mark.UNMARKED
        mapping[TransitionState.CORRECT]   = Mark.CORRECT
        mapping[TransitionState.INCORRECT] = Mark.INCORRECT
        mapping[TransitionState.CORRECTED] = Mark.INCORRECT

        return mapping[this.state.transitionState]
    }

    answerInputTextBox() {
        let onChange
        if (this.inCorrectingState()) {
            onChange = (event) => {
                if (event.target.value === this.props.q.answer) {
                    this.setState({transitionState: TransitionState.CORRECTED})
                }
            }
        } else {
            onChange = (event) => {this.setState({currentAnswer: event.target.value})}
        }
        return (
            <textarea id="answer-input-textbox" rows="5" cols="50" readOnly={this.inDoneState()} key="answer-input-textbox"
                      onChange={onChange}/>
        )
    }

    inDoneState() {
        let doneStates = [TransitionState.CORRECT, TransitionState.CORRECTED]
        return doneStates.includes(this.state.transitionState)
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

    button() {
        if (this.state.transitionState === TransitionState.UNMARKED) {
            return this.submitForMarkingButton()
        } else if (this.inDoneState()) {
            return continueButton(this.props.completionListener, true)
        } else {
            return continueButton(() => {}, false) // disabled continue button
        }
    }

    submitForMarkingButton() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.

        // Issue
        // It is inefficient to be re-rendering the submitForMarkingButton everytime the currentAnswer changes
        switch (this.mark(this.state.currentAnswer)) {
            case Mark.CORRECT:
                return submitForMarkingButton(() => {setState({transitionState: TransitionState.CORRECT})})
            case Mark.INCORRECT:
                return submitForMarkingButton(() => {setState({transitionState: TransitionState.INCORRECT})})
            default:
                return submitForMarkingButton(() => {})
        }
    }
}

const TransitionState = {
    UNMARKED: 0,
    CORRECT: 1,
    INCORRECT: 3,
    CORRECTED: 4
}