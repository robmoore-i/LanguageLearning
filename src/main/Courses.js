// React
import React, {Component} from "react"

// Resources
import '../styles/Courses.css'
import georgia from '../images/flagGeorgia.svg'
import germany from '../images/flagGermany.svg'

export default class Courses extends Component {
    render() {
        return [
            <header className="Courses-header">
                <h1 className="Courses-title">Choose a course</h1>
            </header>,

            <body className="Courses-body">
                <div className="Courses-list">
                    <CourseButton name="Georgian" src={georgia}/>
                    <CourseButton name="German" src={germany}/>
                </div>
            </body>
        ]
    }
}

class CourseButton extends Component {
    render() {
        return [
            <div>
                <a>
                    <h3 className="Course-title">{this.props.name}</h3>
                    <img className="Course-icon"
                         alt={this.props.name}
                         src={this.props.src}/>
                </a>
            </div>,
            <br />,
            <br />
        ]
    }
}