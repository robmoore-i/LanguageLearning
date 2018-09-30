// React
import React, {Component} from "react";

// Resources
import '../styles/LessonMap.css'

export default class LessonMap extends Component {
    courseName() {
        return this.props.location.split('/')[4]
    }

    render() {
        let courseName = this.courseName()

        return (
            <div className="Lesson-map">
                <p>
                    This is a lesson map for the {courseName} course
                </p>
            </div>
        )
    }
}