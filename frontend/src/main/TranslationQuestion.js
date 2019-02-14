// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/TranslationQuestion.css'
// Main
import Mark from "./Mark"
import {Marker} from "./Marker"
import {continueButton, disabledContinueButton, submitForMarkingButton} from "./Question"

export default class TranslationQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentAnswer: "",
            transitionState: TransitionState.UNMARKED,
            submittedAnswer: null
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

            this.button("click")
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
                    this.props.analytics.recordEvent("corrected#translationquestion-" + this.props.q.given + "->" + this.state.submittedAnswer + "->" + event.target.value)
                    this.setState({transitionState: TransitionState.CORRECTED})
                }
            }
            onKeyDown = (event) => {}
        } else {
            onChange = (event) => {this.setState({currentAnswer: event.target.value})}
            onKeyDown = (event) => {
                if (event.key === "Enter") {
                    this.button("press-enter").props.onClick()
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

    button(submissionMethod) {
        switch (this.state.transitionState.id) {
            case TransitionState.IDs.UNMARKED:
                return this.submitForMarkingButton(submissionMethod)
            case TransitionState.IDs.CORRECT:
                return continueButton(this.props.onCorrect)
            case TransitionState.IDs.CORRECTED:
                return continueButton(this.props.onIncorrect)
            default:
                return disabledContinueButton
        }
    }

    submitForMarkingButton(submissionMethod) {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.

        // Issue: It is inefficient to be re-rendering the submitForMarkingButton every time the currentAnswer changes
        let nextTransitionState = this.markCurrentAnswer()

        if (nextTransitionState === TransitionState.UNMARKED) {
            return submitForMarkingButton(() => {
            })
        }

        return submitForMarkingButton(() => {
            this.props.analytics.recordEvent("submit@mark-answer-button&" + submissionMethod + "&" + nextTransitionState.toString() + "#translationquestion-" + this.props.q.given + "->" + this.state.currentAnswer)
            setState({
                transitionState: nextTransitionState,
                submittedAnswer: this.state.currentAnswer
            })
        })
    }

    markCurrentAnswer() {
        switch (this.marker.mark(this.props.q, this.state.currentAnswer)) {
            case Mark.CORRECT:
                return TransitionState.CORRECT

            case Mark.INCORRECT:
                return TransitionState.INCORRECT

            default:
                return TransitionState.UNMARKED
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

    function init(id, name, mark) {
        return {
            mark: mark,
            id: id,

            isDoneState: () => {
                return id === TransitionStateIds.CORRECT || id === TransitionStateIds.CORRECTED
            },

            isCorrectingState: () => {
                return id === TransitionStateIds.INCORRECT || id === TransitionStateIds.CORRECTED
            },

            toString: () => {
                return name
            }
        }
    }

    return {
        UNMARKED: init(TransitionStateIds.UNMARKED, "unmarked", Mark.UNMARKED),
        CORRECT: init(TransitionStateIds.CORRECT, "correct", Mark.CORRECT),
        INCORRECT: init(TransitionStateIds.INCORRECT, "incorrect", Mark.INCORRECT),
        CORRECTED: init(TransitionStateIds.CORRECTED, "correct", Mark.INCORRECT),
        IDs: TransitionStateIds
    }
})()
