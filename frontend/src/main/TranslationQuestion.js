// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/TranslationQuestion.css'
// Main
import Mark from "./Mark"
import {Marker} from "./Marker"
import {submitForMarkingButton, continueButton, disabledContinueButton} from "./Question"

export default class TranslationQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentAnswer: "",
            transitionState: TransitionState.UNMARKED
        }

        this.marker = Marker()

        this.answerInputTextBoxRef = React.createRef()
    }

    componentDidMount() {
        // Yuck. This is test-only control-flow management.
        try {
            this.answerInputTextBoxRef.current.focus()
        } catch (e) {
            // This branch is entered during a shallow render
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
        let prompt = this.state.transitionState.isCorrectingState() ? this.correctionPrompt() : null
        return (
            <div id="question-header" key="question-header">
                <span id="question-instruction">What is the translation of </span>
                <span id="question-given">{this.props.q.given} </span>
                <span id={this.state.transitionState.mark.id}>
                    <img src={this.state.transitionState.mark.img} className="question-result" alt="mark-result-status" />
                </span>
                {prompt}
            </div>
        )
    }

    correctionPrompt() {
        return [
            <div key="question-title--break--correction-prompt">
                <br />
            </div>,
            <div key="correction-prompt">
                <span id="correction-prompt">Type out the correct answer </span>
                <span id="correction-answer">{this.correctionAnswer()}</span>
            </div>
        ]
    }

    correctionAnswer() {
        if ("answer" in this.props.q) {
            return this.props.q.answer
        } else {
            return this.props.q.answers[0]
        }
    }

    answerInputTextBox() {
        let onChange, onKeyDown
        if (this.state.transitionState.isCorrectingState()) {
            onChange = (event) => {
                if (this.marker.mark(this.props.q, event.target.value) === Mark.CORRECT) {
                    this.setState({transitionState: TransitionState.CORRECTED})
                }
            }
            onKeyDown = (event) => {}
        } else {
            onChange = (event) => {this.setState({currentAnswer: event.target.value})}
            onKeyDown = (event) => {
                if (event.key === "Enter") {
                    this.pressButton()
                }
            }
        }

        return (
            <textarea autoFocus id="answer-input-textbox" key="answer-input-textbox" ref={this.answerInputTextBoxRef}
                rows="5"
                cols="50"
                readOnly={this.state.transitionState.isDoneState()}
                onChange={onChange}
                onKeyDown={onKeyDown}/>
        )
    }

    pressButton() {
        this.button().props.onClick()
    }

    button() {
        switch(this.state.transitionState.id) {
            case TransitionState.IDs.UNMARKED:
                return this.submitForMarkingButton()
            case TransitionState.IDs.CORRECT:
                return continueButton(this.props.onCorrect)
            case TransitionState.IDs.CORRECTED:
                return continueButton(this.props.onIncorrect)
            default:
                return disabledContinueButton
        }
    }

    submitForMarkingButton() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.

        // Issue: It is inefficient to be re-rendering the submitForMarkingButton every time the currentAnswer changes
        switch (this.marker.mark(this.props.q, this.state.currentAnswer)) {
            case Mark.CORRECT:
                return submitForMarkingButton(() => {setState({transitionState: TransitionState.CORRECT})})
            case Mark.INCORRECT:
                return submitForMarkingButton(() => {setState({transitionState: TransitionState.INCORRECT})})
            default:
                return submitForMarkingButton(() => {})
        }
    }
}

// Encapsulates the state transition diagram representing the behaviour of a TranslationQuestion.
const TransitionState = (() => {
    const TransitionStateIds = {
        UNMARKED: 0,
        CORRECT: 1,
        INCORRECT: 3,
        CORRECTED: 4,
    }

    function init(id, mark) {
        return {
            mark: mark,
            id: id,

            isDoneState: () => {
                return id === TransitionStateIds.CORRECT || id === TransitionStateIds.CORRECTED
            },

            isCorrectingState: () => {
                return id === TransitionStateIds.INCORRECT || id === TransitionStateIds.CORRECTED
            }
        }
    }

    return {
        UNMARKED:  init(TransitionStateIds.UNMARKED,  Mark.UNMARKED),
        CORRECT:   init(TransitionStateIds.CORRECT,   Mark.CORRECT),
        INCORRECT: init(TransitionStateIds.INCORRECT, Mark.INCORRECT),
        CORRECTED: init(TransitionStateIds.CORRECTED, Mark.INCORRECT),
        IDs: TransitionStateIds
    }
})()
