// React
import React, {Component} from "react";
// Resources
import '../styles/MultipleChoiceQuestion.css'
// Main
import Mark from "./Mark"

export default class MultipleChoiceQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeChoice: Choices.NONE,
            markResult: Mark.UNMARKED
        }
    }

    MultipleChoiceCheckBox(choice) {
        return [
            <input id={"choicebox-" + choice}
                   type="radio"
                   key="checkbox"
                   checked={this.state.activeChoice === choice}
                   onChange={() => {
                       this.setState({activeChoice: choice})
                   }}/>,
            <span id={"choiceValue-" + choice} key="choiceValue">{this.props.q[choice]}</span>
        ]
    }

    mark(choice) {
        if (choice === Choices.NONE) {
            return Mark.UNMARKED
        } else if (choice === this.props.q.answer) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    render() {
        return [
            <div key="question-title">
                <span id="question">{"Which of these " + this.props.q.question + "?"}</span>
                <span id={this.state.markResult.id}>
                    <img src={this.state.markResult.img} className="question-result" alt="mark-result-status" />
                </span>
            </div>,
            <div key="choices">
                {this.MultipleChoiceCheckBox(Choices.A)}
                {this.MultipleChoiceCheckBox(Choices.B)}
                {this.MultipleChoiceCheckBox(Choices.C)}
                {this.MultipleChoiceCheckBox(Choices.D)}
            </div>,
            <a id="submit-for-marking-button" key="submit-for-marking-button"
               onClick={() => {
                   this.setState({markResult: this.mark(this.state.activeChoice)})
               }}>
                Mark
            </a>
        ]
    }
}

export const Choices = {
    NONE: "!",
    A: "a",
    B: "b",
    C: "c",
    D: "d",
}