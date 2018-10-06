// React
import React, {Component} from "react";
import { Link } from 'react-router-dom'

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
        let makeLessonButton = (lessonName => <LessonButton key={lessonName} lessonName={lessonName} courseName={courseName} />)
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
    cleanupLessonName(lessonName) {
        let isNotAlphanumeric = c => /[^a-zA-Z]/.test(c)
        return lessonName.split("").map((c) => {
            if (c === " ") {
                return "_"
            } else if (isNotAlphanumeric(c)) {
                return ""
            } else {
                return c
            }
        }).join("")
    }

    render() {
        let lessonName = this.props.lessonName
        let lessonNameForURL = this.cleanupLessonName(lessonName)
        let linkTo = this.props.courseName + "/" + lessonNameForURL
        return (
            <Link className="Lesson-button" to={linkTo}>
                {lessonName}
            </Link>
        )
    }
}