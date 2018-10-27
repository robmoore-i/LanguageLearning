// React
import React, {Component} from "react"
// Resources
import '../styles/Courses.css'

export default class Courses extends Component {
    constructor(props) {
        super(props)
        this.state = {
            courses: [],
            loaded: false
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.props.server.fetchCourses().then(courses => {
            setState({
                courses: courses,
                loaded: true
            })
        })
    }

    courseButtons() {
        return this.state.courses.map(course => {
            return <CourseButton id={"course-button-" + course.name} key={course.name}
                                 courseName={course.name}
                                 image={{type: course.imageType, src: course.image}} />
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

class CourseButton extends Component {
    constructor(props) {
        super(props)
        this.img = this.readImg(this.props.image)
    }

    readImg(image) {
        if (image.type === "svg") {
            let svgB64 = btoa(image.src)
            return <img className="Course-icon" alt={this.props.courseName} src={"data:image/svg+xml;base64," + svgB64} />
        }
    }

    render() {
        return (
            <div>
                <h3 className="Course-title">{this.props.courseName}</h3>
                <a id={"course-link-" + this.props.courseName} href={"courses/" + this.props.courseName}>
                    {this.img}
                </a>
                <br/>
                <br/>
            </div>
        )
    }
}