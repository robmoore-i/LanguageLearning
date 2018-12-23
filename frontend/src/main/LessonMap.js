// React
import React, {Component} from "react"
// Resources
import '../styles/LessonMap.css'
// Main
import LessonButton from "./LessonButton"

export default class LessonMap extends Component {
    constructor(props) {
        super(props)

        this.server = this.props.server
        this.courseName = this.props.courseName

        this.state = {
            lessonNames: [],
            loaded: false
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.server.fetchLessonNames(this.courseName).then(lessonNames => {
            setState({
                lessonNames: lessonNames.topicLessonNames,
                loaded: true
            })
        })
    }

    renderLoading() {
        return (
            <header key="header" className="Lesson-map-header">
                <h1 className="Lesson-map-title">Loading {this.courseName} lessons</h1>
            </header>
        )
    }

    renderLoaded() {
        let lessonButtons = this.state.lessonNames.map(lessonName => {
            return <LessonButton key={lessonName} lessonName={lessonName} courseName={this.courseName} />
        })
        return [
            <header key="header" className="Lesson-map-header">
                <h1 className="Lesson-map-title">Choose a {this.courseName} lesson</h1>
            </header>,

            <div key="body" className="Lesson-list">{lessonButtons}</div>
        ]
    }

    render() {
        if (this.state.loaded) {
            return this.renderLoaded()
        } else {
            return this.renderLoading()
        }
    }
}
