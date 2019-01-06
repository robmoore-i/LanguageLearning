// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'
import '../styles/MultipleChoiceQuestion.css'
// Main
import Mark from "./Mark"
import {continueButton, submitForMarkingButton} from "./Question"
import {randomChoice} from './random'
import {isLowercaseLetter, isOneDigitNumber} from './string'

export default class MultipleChoiceQuestion extends Component {
    constructor(props) {
        super(props)

        this.nChoices = 4

        this.state = {
            activeChoice: Choices.NONE,
            markResult: Mark.UNMARKED
        }
    }

    onKeyDownClosure(mcq) {
        return (event) => {
            let k = event.key
            if (k === "Enter") {
                mcq.button().props.onClick()
            } else if (Choices.isChoiceKey(k)) {
                mcq.setState({activeChoice: Choices.fromKey(k)})
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
            let choice = Choices.fromInt(i)
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
        if (choice === Choices.NONE) {
            return Mark.UNMARKED
        } else if (choice === this.props.q.answer) {
            return Mark.CORRECT
        } else {
            return Mark.INCORRECT
        }
    }
}

const ChoicesClass = {
    init: (nChoices) => {
        let capitalAlphabet = "ABCD"
        let o = {}
        let choiceEnumValues = []
        for (var i = 0; i < nChoices; i++) {
            let choiceCapitalLetter = capitalAlphabet.charAt(i)
            let choiceValue = choiceCapitalLetter.toLowerCase()
            o[choiceCapitalLetter] = choiceValue
            choiceEnumValues.push(choiceValue)
        }
        let NONE = "!"
        o.NONE = NONE
        o.random = () => randomChoice(choiceEnumValues)
        o.fromInt = (i) => choiceEnumValues[i]
        let fromKey = (k) => {
            if (isLowercaseLetter(k) && choiceEnumValues.includes(k)) {
                return k
            } else if (isOneDigitNumber(k)) {
                let indexOneBased = parseInt(k)
                if (indexOneBased <= nChoices) {
                    return choiceEnumValues[indexOneBased - 1]
                }
            } else {
                return NONE
            }
        }
        o.fromKey = fromKey
        o.isChoiceKey = (k) => fromKey(k) != NONE
        return o
    },

    random: (n) => {}
}

export const Choices = ChoicesClass.init(4)

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
             key={"choice-" + choice + "-key"}
             className={classes().join(" ")}
             onClick={onClick()}>
            <input id={"choicebox-" + choice}
                   type="radio"
                   key={"checkbox-" + choice}
                   checked={checked}
                   onChange={() => {} /* This removes a warning about having a `checked` prop without an `onChange` handler.*/}/>
            <span id={"choiceValue-" + choice} key="choiceValue">{MCQ.props.q[choice]}</span>
        </div>
    )
}
