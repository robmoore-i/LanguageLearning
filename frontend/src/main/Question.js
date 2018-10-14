// React
import React, {Component} from "react";
// Resources
import '../styles/Question.css'

export default class Question extends Component {
    render() {
        return (
            <h1 id="question-title">{"Translate \"" + this.props.q.given + "\""}</h1>
        )
    }
}