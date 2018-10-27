// React
import React, {Component} from "react"
// Resources
import '../styles/Courses.css'
import georgia from '../images/flagGeorgia.svg'
import germany from '../images/flagGermany.svg'

export default class Courses extends Component {
    constructor(props) {
        super(props)
        this.state = {
            courseNames: [],
            loaded: false
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.props.server.fetchCourseNames().then(courseNames => {
            setState({
                courseNames: courseNames,
                loaded: true
            })
        })
    }

    render() {
        return [
            <header key="header" className="Courses-header">
                <h1 className="Courses-title">Choose a course</h1>
            </header>,

            <div key="body" className="Courses-list">
                <CourseButton id="course-button-georgian" key="Georgian" name="Georgian" src={georgia}/>
                <CourseButton id="course-button-german"   key="German"   name="German"   src={germany}/>
            </div>
        ]
    }
}

class CourseButton extends Component {
    render() {
        let imageSrc = this.props.src
        let capitalisedName = this.props.name
        let courseName = capitalisedName.toLowerCase()
        return (
            <div>
                <h3 className="Course-title">{capitalisedName}</h3>
                <a id={"course-link-" + courseName} href={"courses/" + courseName}>
                    <img className="Course-icon" alt={capitalisedName} src={imageSrc}/>
                </a>
                <br/>
                <br/>
            </div>
        )
    }
}