// React
import React, {Component} from "react"
// Resources
import '../styles/Question.css'

export default class ReadingQuestion extends Component {
    render() {
        return [
            <div id="question-source" key="question-source">
                {this.props.q.source}
            </div>
        ]
    }
}