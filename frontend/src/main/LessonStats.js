// React
import React, {Component} from "react"

// Resources
import '../styles/LessonStats.css'

export default class LessonStats extends Component {
    constructor(props) {
        super(props)
        this.accuracyPercentage = this.props.accuracyPercentage
        this.lessonTime = this.props.lessonTime
        this.courseName = this.props.courseName
    }

    render() {
        let accuracyTo1dpString = (Math.round(10 * this.accuracyPercentage) / 10).toString()
        return (
            <div id="lesson-stats" key="lesson-stats">
                <br />
                <div id="lesson-accuracy">
                    <span>Accuracy: </span>
                    <span id="lesson-accuracy-number">{accuracyTo1dpString + "%"}</span>
                </div>
                <br />
                <div id="lesson-time">
                    <span>Time taken: </span>
                    <span id="lesson-time-number">{this.lessonTime + " seconds"}</span>
                </div>
                <br />
                <a id="back-to-lessonmap-button" href={"/courses/" + this.courseName}>Back to Lesson Map</a>
            </div>
        )
    }
}
