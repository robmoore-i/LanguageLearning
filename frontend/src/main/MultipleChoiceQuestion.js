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

    render() {
        return [
            <span id="question-title" key="question-title">{"Which of these " + this.props.q.question + "?"}</span>,
            <div key="choices">
                {this.MultipleChoiceCheckBox(Choices.A)}
                {this.MultipleChoiceCheckBox(Choices.B)}
                {this.MultipleChoiceCheckBox(Choices.C)}
                {this.MultipleChoiceCheckBox(Choices.D)}
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