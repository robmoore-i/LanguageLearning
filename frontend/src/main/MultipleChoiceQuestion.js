// React
import React, {Component} from "react";
// Resources
import '../styles/MultipleChoiceQuestion.css'

export default class MultipleChoiceQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeChoice: Choices.NONE
        }
    }

    render() {
        let choiceValues = {
            a: this.props.q.a,
            b: this.props.q.b,
            c: this.props.q.c,
            d: this.props.q.d,
        }

        let MultipleChoiceCheckBox = (whichChoice) => {
            return [
                <input id={"choicebox-" + whichChoice}
                       type="radio"
                       key="checkbox"
                       checked={this.state.activeChoice === whichChoice}
                       onChange={() => {
                           this.setState({activeChoice: whichChoice})
                       }}/>,
                <span id={"choice-" + whichChoice} key="choiceValue">{choiceValues[whichChoice]}</span>
            ]
        }

        return [
            <span id="question-title" key="question-title">{"Which of these " + this.props.q.question + "?"}</span>,
            <div key="choices">
                {MultipleChoiceCheckBox(Choices.A)}
                {MultipleChoiceCheckBox(Choices.B)}
                {MultipleChoiceCheckBox(Choices.C)}
                {MultipleChoiceCheckBox(Choices.D)}
            </div>
        ]
    }
}

const Choices = {
    NONE: "!",
    A: "a",
    B: "b",
    C: "c",
    D: "d",
}