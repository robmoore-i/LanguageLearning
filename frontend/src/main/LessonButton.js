// React
import React, {Component} from "react";
// Resources
import '../styles/LessonButton.css'
// Main
import {encodeUrl} from "./App"

export default class LessonButton extends Component {
    constructor(props) {
        super(props)
        this.encodedLessonName = encodeUrl(this.props.lessonName)
        this.href = this.makeHref(window.location.pathname)
    }

    makeHref(pathname) {
        if (pathname[pathname.length - 1] === "/") {
            return this.encodedLessonName
        } else {
            return this.props.courseName + "/" + this.encodedLessonName
        }
    }

    render() {
        return (
            <a className="Lesson-button" href={this.href}>
                {this.props.lessonName}
            </a>
        )
    }
}
