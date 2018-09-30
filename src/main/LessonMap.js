// React
import React, {Component} from "react";

// Resources
import '../styles/LessonMap.css'

export default class LessonMap extends Component {
    constructor(props) {
        super(props)
        this.lessonNames = props.server.fetchLessonNames()
    }

    courseName() {
        return this.props.location.split('/')[4]
    }

    render() {
        let courseName = this.courseName()
        let capitalise = (s => s[0].toUpperCase() + s.substring(1))
        let capitalisedCourseName = capitalise(courseName)
        let listMembers = this.lessonNames.map(lessonName => <LessonButton key={lessonName} lessonName={lessonName} />)

        return (
            <div className="Lesson-map">
                <h1>Lesson Map: {capitalisedCourseName}</h1>
                <div className="Lesson-list">{listMembers}</div>
            </div>
        )
    }
}

class LessonButton extends Component {
    render() {
        return (
            <div className="Lesson-button">
                {this.props.lessonName}
            </div>
        )
    }
}