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

    onKeyDownClosure(mcq) {
        return (event) => {
            let k = event.key
            if (k === "a" || k === "1") {
                mcq.setState({activeChoice: Choices.A})
            } else if (k === "b" || k === "2") {
                mcq.setState({activeChoice: Choices.B})
            } else if (k === "c" || k === "3") {
                mcq.setState({activeChoice: Choices.C})
            } else if (k === "d" || k === "4") {
                mcq.setState({activeChoice: Choices.D})
            } else if (k === "Enter") {
                mcq.button().props.onClick()
            }
        }
    }

    componentWillUnmount() {
        window.onkeydown = (event) => {}
    }

    componentDidMount() {
        window.onkeydown = this.onKeyDownClosure(this)
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
                {MultipleChoiceCheckBox(Choices.A, this)}
                {MultipleChoiceCheckBox(Choices.B, this)}
                {MultipleChoiceCheckBox(Choices.C, this)}
                {MultipleChoiceCheckBox(Choices.D, this)}
            </div>,
            <div key="choices--break--submit-button">
                <br />
                <br />
            </div>,
            this.button()
        ]
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

    submitForMarkingButton() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback.
        const markResult = this.mark(this.state.activeChoice)
        let onClick = () => {setState({markResult: markResult})}
        return submitForMarkingButton(onClick)
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
}

export const Choices = {
    NONE: "!",
    A: "a",
    B: "b",
    C: "c",
    D: "d",
}

function MultipleChoiceCheckBox(choice, MCQ) {
    let checked = MCQ.state.activeChoice === choice

    function classes() {
        let classes = ["choice"]

        if (checked) {
            classes.push("choice-checked")
        } else {
            classes.push("choice-unchecked")
        }

        let isCorrectAnswer = choice === MCQ.props.q.answer
        let questionHasBeenMarkedIncorrect = MCQ.state.markResult === Mark.INCORRECT

        if (questionHasBeenMarkedIncorrect) {
            if (isCorrectAnswer) {
                classes.push("choice-correction")
            } else if (checked) {
                classes.push("choice-marked-incorrect")
            }
        }

        return classes
    }

    function onClick() {
        let hasBeenMarked = MCQ.state.markResult !== Mark.UNMARKED
        if (hasBeenMarked) {
            return () => {}
        } else {
            return () => {MCQ.setState({activeChoice: choice})}
        }
    }

    return (
        <div id={"choice-" + choice}
             className={classes().join(" ")}
             onClick={onClick()}>
            <input id={"choicebox-" + choice}
                   type="radio"
                   key="checkbox"
                   checked={checked}
                   onChange={() => {} /* This removes a warning about having a `checked` prop without an `onChange` handler.*/}/>
            <span id={"choiceValue-" + choice} key="choiceValue">{MCQ.props.q[choice]}</span>
        </div>
    )
}
