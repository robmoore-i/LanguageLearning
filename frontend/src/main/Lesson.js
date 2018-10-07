// React
import React, {Component} from "react";
// Resources
import '../styles/Lesson.css'

export default class Lesson extends Component {
    constructor(props) {
        super(props)

        this.server = this.props.server
        this.courseName = this.props.courseName

        this.state = {
            lessonName: this.props.lessonNameInUrl, // Placeholder until server response.
            loaded: false
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.server.fetchLesson(this.props.lessonNameInUrl).then(lesson => {
            setState({
                lessonName: lesson.name,
                loaded: true
            })
        })
    }

    renderLoading() {
        return (
            <h1>Loading {this.courseName}: {this.state.lessonName}</h1>
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