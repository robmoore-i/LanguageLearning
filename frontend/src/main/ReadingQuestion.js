// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import Mark from "./Mark";
import {submitForMarkingButton} from "./Question";

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
            <div id="question-source" key="question-source">
                {this.props.q.source}
            </div>,
            <div key="questions">
                {this.questions()}
            </div>,
            this.button()
        ]
    }

    questions() {
        return this.props.q.questions.map((q, i) => {
            return this.PosedQuestion(i, q)
        })
    }

    // The (i)th posed question, (q), about the extract
    PosedQuestion(i, q) {
        return [
            <div id={"question-given-" + String(i)} key={"question-given-" + String(i)}>
                {q.given}
            </div>,
            <span id={this.state.marks[i].id + "-" + String(i)} key={this.state.marks[i].id + "-" + String(i)}>
                    <img src={this.state.marks[i].img} className="question-result" alt="mark-result-status" />
            </span>,
            this.answerInputTextBox(i)
        ]
    }

    answerInputTextBox(n) {
        let onChange = (event) => {
            this.setState((state) => {
                let newAnswers = state.currentAnswers
                newAnswers[n] = event.target.value
                return {currentAnswers: newAnswers}
            })
        }

        return <textarea id={"answer-input-textbox-" + String(n)} key={"answer-input-textbox-" + String(n)}
                                      rows="5" cols="50"
                                      onChange={onChange}/>;
    }

    button() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.
        return submitForMarkingButton(() => {
            setState({
                marked: true,
                marks: this.markAnswers()})
        })
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