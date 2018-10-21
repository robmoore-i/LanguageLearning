// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/MultipleChoiceQuestion.css'
// Main
import Mark from "./Mark"
import {continueButton, submitForMarkingButton} from "./Question"

export default class MultipleChoiceQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeChoice: Choices.NONE,
            markResult: Mark.UNMARKED
        }
    }

    MultipleChoiceCheckBox(choice) {
        let checked = this.state.activeChoice === choice
        let checkClass = checked ? "choice-checked" : "choice-unchecked"

        let isCorrectAnswer = choice === this.props.q.answer
        let questionHasBeenMarkedIncorrect = this.state.markResult === Mark.INCORRECT
        let correctionClass = (isCorrectAnswer && questionHasBeenMarkedIncorrect) ? "choice-correction" : ""

        let hasBeenMarked = this.state.markResult !== Mark.UNMARKED
        let onClick = hasBeenMarked ? () => {} : () => {this.setState({activeChoice: choice})}

        return (
            <div id={"choice-" + choice}
                 className={"choice" + " " + checkClass + " " + correctionClass}
                 onClick={onClick}>
                <input id={"choicebox-" + choice}
                       type="radio"
                       key="checkbox"
                       checked={checked}
                       onChange={() => {} /* This removes a warning about having a `checked` prop without an `onChange` handler.*/}/>
                <span id={"choiceValue-" + choice} key="choiceValue">{this.props.q[choice]}</span>
            </div>
        )
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

    submitForMarkingButton() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.
        const markResult = this.mark(this.state.activeChoice)
        let onClick = () => {setState({markResult: markResult})}
        return submitForMarkingButton(onClick)
    }

    button() {
        switch (this.state.markResult) {
            case Mark.UNMARKED:
                return this.submitForMarkingButton()
            case Mark.CORRECT:
                return continueButton(this.props.onCorrect)
            case Mark.INCORRECT:
                return continueButton(this.props.onIncorrect)
            default:
                throw new Error("MCQ - button(): state->markResult is not any of the three Mark instances.")
        }
    }

    render() {
        return [
            <br key="header--break--question-title"/>,
            <div id="question-title" key="question-title">
                <span id="question">{"Which of these " + this.props.q.question + "?"}</span>
                <span id={this.state.markResult.id}>
                    <img src={this.state.markResult.img} className="question-result" alt="mark-result-status" />
                </span>
            </div>,
            <br key="question-title--break--choices" />,
            <div key="choices">
                {this.MultipleChoiceCheckBox(Choices.A)}
                {this.MultipleChoiceCheckBox(Choices.B)}
                {this.MultipleChoiceCheckBox(Choices.C)}
                {this.MultipleChoiceCheckBox(Choices.D)}
            </div>,
            <div key="choices--break--submit-button">
                <br />
                <br />
            </div>,
            this.button()
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