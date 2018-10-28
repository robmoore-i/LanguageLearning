// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'

export default class ReadingQuestion extends Component {
    questions() {
        return this.props.q.questions.map((q, i) => {
            return <div id={"question-" + String(i+1) + "-given"} key={"question-" + String(i+1) + "-given"}>
                {q.given}
            </div>
        })
    }

    render() {
        return [
            <div id="question-source" key="question-source">
                {this.props.q.source}
            </div>,
            <div key="questions">
                {this.questions()}
            </div>
        ]
    }
}