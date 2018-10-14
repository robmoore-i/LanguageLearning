// React
import React, {Component} from "react";
// Resources
import '../styles/Question.css'

export default class Question extends Component {
    constructor(props) {
        super(props)

        this.state = {
            markResult: Mark.UNMARKED,
            currentAnswer: ""
        }
    }

    markAnswer(answer) {
        if (answer === this.props.q.answer) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    render() {
        return [
            <h1 id="question-title" key="question-title">{"Translate \"" + this.props.q.given + "\""}</h1>,
            <input id="answer-input-textbox"
                   key="answer-input-textbox"
                   type="text"
                   onChange={(event) => {
                       this.setState({currentAnswer: event.target.value})
                    }}/>,
            <button id="submit-for-marking-button"
                    key="submit-for-marking-button"
                    onClick={() => {
                        this.setState({markResult: this.markAnswer(this.state.currentAnswer)})
                    }}>
                Mark
            </button>,
            <span key="question-result-mark" id={this.state.markResult.id}/>
        ]
    }
}

let Mark = (() => {
    function Mark(i, id) {
        return {
            i: i,
            id: id
        }
    }

    return {
        UNMARKED:  Mark(0, "question-result-unmarked"),
        CORRECT:   Mark(1, "question-result-correct"),
        INCORRECT: Mark(2, "question-result-incorrect")
    }
})()