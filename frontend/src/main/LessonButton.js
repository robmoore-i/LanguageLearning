// React
import React, {Component} from "react";
// Resources
import '../styles/LessonButton.css'

export default class LessonButton extends Component {
    constructor(props) {
        super(props)
        this.encodedLessonName = this.encodeUrl(this.props.lessonName)
        this.href = this.makeHref(window.location.pathname)
    }

    render() {
        return (
            <a
                id={"lesson-button-" + this.encodedLessonName}
                className="Lesson-button"
                href={this.href}
                onClick={() => this.props.analytics.recordEvent("click@lesson-button-" + this.props.courseName + "-" + this.encodedLessonName)}
            >
                {this.props.lessonName}
            </a>
        )
    }

    encodeUrl(string) {
        return encodeURIComponent(string.split(" ").join("_"))
    }

    makeHref(pathname) {
        if (pathname[pathname.length - 1] === "/") {
            return this.encodedLessonName
        } else {
            return this.props.courseName + "/" + this.encodedLessonName
        }
    }
}
