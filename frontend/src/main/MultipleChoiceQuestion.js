// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/MultipleChoiceQuestion.css'
// Main
import Mark from "./Mark"
import {Choices} from "./Choices"
import {continueButton, submitForMarkingButton} from "./Question"

export default class MultipleChoiceQuestion extends Component {
    constructor(props) {
        super(props)

        this.nChoices = numberOfChoices(this.props.q)
        this.choices = Choices(this.nChoices)

        this.state = {
            activeChoice: this.choices.NONE,
            markResult: Mark.UNMARKED
        }
    }

    onKeyDownClosure(mcq) {
        return (event) => {
            let k = event.key
            if (k === "Enter") {
                mcq.button().props.onClick()
            } else if (mcq.choices.isChoiceKey(k)) {
                mcq.setState({activeChoice: mcq.choices.fromKey(k)})
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
                {this.choiceCheckBoxes()}
            </div>,
            <div key="choices--break--submit-button">
                <br />
                <br />
            </div>,
            this.button()
        ]
    }

    choiceCheckBoxes() {
        let choices = []
        for (var i = 0; i < this.nChoices ; i++) {
            let choice = this.choices.fromInt(i)
            choices.push(MultipleChoiceCheckBox(choice, this))
        }
        return choices
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
        if (choice === this.choices.NONE) {
            return Mark.UNMARKED
        } else if (choice === this.props.q.answer) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }

    barSeparateChoices() {
        return this.choices.toBarSeparatedString(this.props.q)
    }
}

function MultipleChoiceCheckBox(choice, mcq) {
    let checked = mcq.state.activeChoice === choice

    function classes() {
        let classes = ["choice"]

        if (checked) {
            classes.push("choice-checked")
        } else {
            classes.push("choice-unchecked")
        }

        let isCorrectAnswer = choice === mcq.props.q.answer
        let questionHasBeenMarkedIncorrect = mcq.state.markResult === Mark.INCORRECT

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
        let hasBeenMarked = mcq.state.markResult !== Mark.UNMARKED
        if (hasBeenMarked) {
            return () => {}
        } else {
            return () => {
                let vertcicalBarSeparatedChoices = mcq.barSeparateChoices()
                mcq.props.analytics.recordEvent("select@choice-" + choice + "&click#multiplechoicequestion-" + mcq.props.q.question + "-" + vertcicalBarSeparatedChoices)
                mcq.setState({activeChoice: choice})
            }
        }
    }

    return (
        <div id={"choice-" + choice}
             key={"choice-" + choice + "-key"}
             className={classes().join(" ")}
             onClick={onClick()}>
            <input id={"choicebox-" + choice}
                   type="radio"
                   key={"checkbox-" + choice}
                   checked={checked}
                   onChange={() => {} /* This removes a warning about having a `checked` prop without an `onChange` handler.*/}/>
            <span id={"choiceValue-" + choice} key="choiceValue">{mcq.props.q[choice]}</span>
        </div>
    )
}

export function numberOfChoices(mcq) {
    return Object.keys(mcq).length - ["type", "index", "question", "answer"].length
}

export function rmExcessChoices(mcq) {
    let newMCQ = {}

    for (let k in mcq) {
        // noinspection JSUnfilteredForInLoop
        if (mcq[k] !== "!") {
            // noinspection JSUnfilteredForInLoop
            newMCQ[k] = mcq[k]
        }
    }
    return newMCQ
}
