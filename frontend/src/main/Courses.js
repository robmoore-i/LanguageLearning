// React
import React, {Component} from "react"
import { Link } from 'react-router-dom'

// Resources
import '../styles/Courses.css'
import georgia from '../images/flagGeorgia.svg'
import germany from '../images/flagGermany.svg'

export default class Courses extends Component {
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
                <Link id={"course-link-" + courseName} to={"courses/" + courseName}>
                    <img className="Course-icon" alt={capitalisedName} src={imageSrc}/>
                </Link>
                <br/>
                <br/>
            </div>
        )
    }
}