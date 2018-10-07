// React
import React, {Component} from "react";
// Resources
import '../styles/Lesson.css'

export default class Lesson extends Component {
    constructor(props) {
        super(props)

        this.server = this.props.server
        this.courseName = this.props.location.split('/')[4] // Extract course name from url

        this.state = {
            lessonName: this.props.location.split('/')[5], // Temporarily extract lesson name from url
            loaded: false
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.server.fetchLesson().then(lesson => {
            setState({
                lessonName: lesson.name,
                loaded: true
            })
        })
    }

    renderLoading() {
        return (
            <div>Loading {this.courseName}: {this.state.lessonName}</div>
        )
    }

    renderLoaded() {
        let capitalise = (s => s[0].toUpperCase() + s.substring(1))
        let capitalisedCourseName = capitalise(this.courseName)
        return (
            <h1>{capitalisedCourseName}: {this.state.lessonName}</h1>
        )
    }

    render() {
        if (this.state.loaded) {
            return this.renderLoaded()
        } else {
            return this.renderLoading()
        }
    }
}