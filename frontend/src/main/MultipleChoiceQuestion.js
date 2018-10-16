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

        let MultipleChoiceCheckBox = (whichChoice) => {
            let choiceValue = choices[whichChoice]
            return [
                <input id={"choicebox-" + whichChoice} type="radio" key="checkbox"/>,
                <span id={"choice-" + whichChoice} key="choiceValue">{choiceValue}</span>
            ]
        }

        return [
            <span id="question-title" key="question-title">{"Which of these " + this.props.q.question + "?"}</span>,
            <div key="choices">
                {MultipleChoiceCheckBox("a")}
                {MultipleChoiceCheckBox("b")}
                {MultipleChoiceCheckBox("c")}
                {MultipleChoiceCheckBox("d")}
            </div>
        ]
    }
}