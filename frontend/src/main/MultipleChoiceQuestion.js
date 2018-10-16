// React
import React, {Component} from "react";
// Resources
import '../styles/MultipleChoiceQuestion.css'

export default class MultipleChoiceQuestion extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let choices = {
            a: this.props.q.a,
            b: this.props.q.b,
            c: this.props.q.c,
            d: this.props.q.d,
        }
        return [
            <span id="question-title">{"Which of these " + this.props.q.question + "?"}</span>,
            <div>
                <input type="radio" checked /><span id="choice-a">{choices.a}</span>
                <input type="radio"/><span id="choice-b">{choices.b}</span>
                <br />
                <input type="radio"/><span id="choice-c">{choices.c}</span>
                <input type="radio"/><span id="choice-d">{choices.d}</span>
            </div>

        ]
    }
}