// React
import React, {Component} from "react";

// Resources
import '../styles/LessonMap.css'

export default class LessonMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lessonNames: props.server.fetchLessonNames()
        }
    }

    courseName() {
        return this.props.location.split('/')[4]
    }

    render() {
        let courseName = this.courseName()

        let listMembers = this.state.lessonNames.map((_lessonName, i) => <p key={i}>abc</p>)

        return (
            <div className="Lesson-map">
                <p>
                    This is a lesson map for the {courseName} course
                </p>
                <div className="Lesson-list">
                    {listMembers}
                </div>
            </div>
        )
    }
}