// React
import React, {Component} from "react";
// Resources
import '../styles/MultipleChoiceQuestion.css'

export default class MultipleChoiceQuestion extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span id="question-title">{"Which of these " + this.props.q.question + "?"}</span>
        )
    }
}