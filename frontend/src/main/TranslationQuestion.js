// React
import React, {Component} from "react";
// Resources
import '../styles/TranslationQuestion.css'
// Main
import Mark from "./Mark"

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
            <a id="submit-for-marking-button" key="submit-for-marking-button"
                    onClick={() => {
                        this.setState({markResult: this.mark(this.state.currentAnswer)})
                    }}>
                Mark
            </a>
        ]
    }
}