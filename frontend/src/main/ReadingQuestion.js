// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/ReadingQuestion.css'
// Main
import Mark from "./Mark"
import {submitForMarkingButton, continueButton} from "./Question"

export default class ReadingQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentAnswers: (new Array(this.props.q.questions.length)).fill(""),
            marked: false,
            marks: (new Array(this.props.q.questions.length)).fill(Mark.UNMARKED)
        }
    }

    render() {
        return [
            <div id="question-extract" key="question-extract">
                {this.props.q.extract}
            </div>,
            <div key="questions">
                {this.questions()}
            </div>,
            this.button()
        ]
    }

    questions() {
        const setState = this.setState.bind(this)
        return this.props.q.questions.map((q, i) => {
            return <PosedQuestion id={"posed-question-" + String(i)} key={"posed-question-" + String(i)}
                                  i={i}
                                  question={q}
                                  mark={this.state.marks[i]}
                                  setParentState={setState} />
        })
    }

    button() {
        if (!this.state.marked) {
            const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.
            return submitForMarkingButton(() => {
                setState({
                    marked: true,
                    marks: this.markAnswers()
                })
            })
        } else {
            return continueButton(this.props.onCompletion)
        }
    }

    // Matches currentAnswers against this.props.q.questions
    markAnswers() {
        let marks = (new Array(this.props.q.questions.length)).fill(Mark.UNMARKED)
        for (let i = 0; i < this.state.currentAnswers.length; i++) {
            let actual = this.state.currentAnswers[i]
            let expected = this.props.q.questions[i].answer
            if (actual === expected) {
                marks[i] = Mark.CORRECT
            } else {
                marks[i] = Mark.INCORRECT
            }
        }
        return marks
    }
}

// The (i)th posed question, (question), about the extract. Shows the given (mark) and changing the textbox
// makes a call to (setParentState) to update the parent-level list of answers.
class PosedQuestion extends React.Component {
    render() {
        let correction = this.props.mark === Mark.INCORRECT ? this.correction() : null
        return [
            <div id={"question-given-" + String(this.props.i)} key={"question-given-" + String(this.props.i)}>
                {this.props.question.given}
            </div>,
            <span id={this.props.mark.id + "-" + String(this.props.i)} key={this.props.mark.id + "-" + String(this.props.i)}>
                    <img src={this.props.mark.img} className="question-result" alt="mark-result-status" />
            </span>,
            this.answerInputTextBox(),
            correction
        ]
    }

    answerInputTextBox() {
        let onChange = (event) => {
            let answer = event.target.value
            this.props.setParentState((state) => {
                let newAnswers = state.currentAnswers
                newAnswers[this.props.i] = answer
                return {currentAnswers: newAnswers}
            })
        }

        return <textarea id={"answer-input-textbox-" + String(this.props.i)} key={"answer-input-textbox-" + String(this.props.i)}
                         rows="5" cols="50"
                         onChange={onChange}/>;
    }

    correction() {
        return (
            <div id={"question-correction-" + String(this.props.i)} key={"question-correction-" + String(this.props.i)}>
                {this.props.question.answer}
            </div>
        )
    }
}