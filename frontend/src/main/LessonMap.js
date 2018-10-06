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
        let makeLessonButton = (lessonName => <LessonButton key={lessonName} lessonName={lessonName} />)
        let lessonButtons = this.lessonNames.map(makeLessonButton)

        return [
            <header key="header" className="Lesson-map-header">
                <h1 className="Lesson-map-title">Choose a {courseName} lesson</h1>
            </header>,

            <div key="body" className="Lesson-list">{lessonButtons}</div>
        ]
    }
}

class LessonButton extends Component {
    render() {
        return (
            <div className="Lesson-button">{this.props.lessonName}</div>
        )
    }
}