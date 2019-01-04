// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/ReadingQuestion.css'
// Main
import Mark from "./Mark"
import {Marker} from "./Marker"
import {submitForMarkingButton, continueButton} from "./Question"
import {keySort} from './sorting'

export default class ReadingQuestion extends Component {
    constructor(props) {
        super(props)

        this.noQuestions = false
        if (!this.props.q.questions) { this.noQuestions = true; return }
        if (this.props.q.questions.length === 0) { this.noQuestions = true; return }

        // Make sure the subquestions are in the correct order.
        this.props.q.questions.sort(keySort("index"))

        this.state = {
            currentAnswers: (new Array(this.props.q.questions.length)).fill(""),
            marked: false,
            marks: (new Array(this.props.q.questions.length)).fill(Mark.UNMARKED),
            warning: false
        }

        this.marker = Marker()
    }

    render() {
        if (this.noQuestions) {
            return this.renderNoQuestions()
        } else {
            return this.renderWithQuestions()
        }
    }

    renderExtractPrompt(prompt) {
        return [
            <br key="lesson-header--break--prompt" />,
            <div id="read-the-extract-prompt" key="read-the-extract-prompt" >{prompt}</div>,
            <br key="prompt--break--extract" />,
            <div id="question-extract" key="question-extract">
                {this.props.q.extract}
            </div>,
            <div key="extract--break--questions">
                <br />
                <br />
                <br />
            </div>
        ]
    }

    renderWithQuestions() {
        return this.renderExtractPrompt("Read the text, then answer the questions below").concat(
                [
                    <div key="questions" id="questions">
                        {this.questions()}
                    </div>,
                    <br key="questions--break--unanswered-questions-warning" />,
                    this.unansweredQuestionsWarning(),
                    <br key="unanswered-questions-warning--break--button" />,
                    this.button()
                ]
            )
    }

    renderNoQuestions() {
        let button = continueButton(() => {this.props.onCompletion(0, 0)})
        return this.renderExtractPrompt("").concat([button])
    }

    questions() {
        const setState = this.setState.bind(this)

        // Insertion sort effort is now unnecessary because of the upfront keySort in constructor.
        let inOrderSubquestions = Array(this.props.q.questions.length).fill({})
        this.props.q.questions.forEach((q, idx) => {
            let i = q.index === undefined ? idx : q.index
            inOrderSubquestions[i] = <SubQuestion id={"sub-question-" + String(i)} key={"sub-question-" + String(i)}
                                  i={i}
                                  question={q}
                                  mark={this.state.marks[i]}
                                  setParentState={setState} />
        })
        return inOrderSubquestions
    }

    button() {
        if (!this.state.marked) {
          return this.submitForMarkingButton()
        } else {
          let numCorrectAnswers = this.state.marks.map((mark) => + (mark === Mark.CORRECT)).reduce((a, b) => a + b)
          let numIncorrectAnswers = this.props.q.questions.length - numCorrectAnswers
          return continueButton(() => {this.props.onCompletion(numCorrectAnswers, numIncorrectAnswers)})
        }
    }

    submitForMarkingButton() {
      const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.

      if (this.anySubQuestionsUnanswered() && !this.state.warning) {
        return submitForMarkingButton(() => { // Possible 'key' re-rendering issue
            setState({
                warning: true
            })
        })
      } else {
        return submitForMarkingButton(() => {
            setState({
                marked: true,
                marks: this.markAnswers()
            })
        })
      }
    }

    // Matches this.state.currentAnswers against this.props.q.questions
    markAnswers() {
        let marks = (new Array(this.props.q.questions.length)).fill(Mark.UNMARKED)
        for (let i = 0; i < this.state.currentAnswers.length; i++) {
            marks[i] = this.marker.mark(this.props.q.questions[i], this.state.currentAnswers[i])
        }
        return marks
    }

    anySubQuestionsUnanswered() {
        return this.state.currentAnswers.map((answer) => answer === "").reduce((cur, acc) => cur || acc)
    }

    unansweredQuestionsWarning() {
        if (this.state.warning) {
            return (
                <div id="unanswered-questions-warning" key="unanswered-questions-warning">
                    <span id="you-have-unanswered-questions">You have unanswered questions!</span><br/>
                    Press 'Mark' again to mark your answers as they are.
                </div>
            )
        } else {
            return null
        }
    }
}

// The (i)th posed (question) about the extract. Shows the given (mark) and changing the textbox
// makes a call to (setParentState) to update the parent-level list of answers.
class SubQuestion extends React.Component {
    render() {
        let correction = this.props.mark === Mark.INCORRECT ? this.correction() : null
        return [
            <br key={"top-side-break-" + String(this.props.i)} />,
            <div className="question-header" id={"question-header-" + String(this.props.i)} key={"question-header-" + String(this.props.i)}>
                <div className="question-given" id={"question-given-" + String(this.props.i)} key={"question-given-" + String(this.props.i)}>
                    {this.props.question.given}
                </div>
                <span id={this.props.mark.id + "-" + String(this.props.i)} key={this.props.mark.id + "-" + String(this.props.i)}>
                    <img src={this.props.mark.img} className="question-result-img" alt="mark-result-status" />
                </span>
                {correction}
            </div>,
            <br key={"question-header--break--textarea-" + String(this.props.i)} />,
            this.answerInputTextBox(),
            <br key={"low-side-break-" + String(this.props.i)} />,
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

        let colourClass = "colourclass-" + this.props.mark.id
        let hasBeenMarked = this.props.mark === Mark.CORRECT || this.props.mark === Mark.INCORRECT
        return <textarea className={["answer-input-textbox", colourClass].join(" ")}
                         id={"answer-input-textbox-" + String(this.props.i)}
                         key={"answer-input-textbox-" + String(this.props.i)}
                         rows="5" cols="50"
                         readOnly={hasBeenMarked}
                         onChange={onChange}/>;
    }

    correction() {
        return (
            <div className="question-correction" id={"question-correction-" + String(this.props.i)} key={"question-correction-" + String(this.props.i)}>
                {this.correctionAnswer()}
            </div>
        )
    }

    correctionAnswer() {
        if ("answer" in this.props.question) {
            return this.props.question.answer
        } else {
            return this.props.question.answers[0]
        }
    }
}
