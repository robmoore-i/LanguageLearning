// React
import React, {Component} from "react"
// Resources
import '../styles/Courses.css'
// Main
import CourseButton from './CourseButton'

export default class Courses extends Component {
    constructor(props) {
        super(props)
        this.state = {
            courses: []
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.props.server.fetchCourses().then(courses => {
            setState({
                courses: courses ? courses : []
            })
        })
    }

    courseButtons() {
        return this.state.courses.map(course => {
            return <CourseButton id={"course-button-" + course.name} key={course.name}
                                 courseName={course.name}
                                 image={{type: course.imageType, src: course.image}}
                                 analytics={this.props.analytics}
            />
        })
    }

    render() {
        return [
            <header key="header" className="Courses-header">
                <h1 className="Courses-title">Choose a course</h1>
            </header>,

            <div key="body" className="Courses-list">
                {this.courseButtons()}
            </div>
        ]
    }
}
