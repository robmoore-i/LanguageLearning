// React
import React, {Component} from "react"

// Resources
import '../styles/LessonMap.css'
import georgia from '../images/flagGeorgia.svg'
import germany from '../images/flagGermany.svg'

export default class LessonMap extends Component {
    render() {
        return [
            <header className="Lesson-map-header">
                <h1 className="Lesson-map-title">Choose a course</h1>
            </header>,

            <body className="Lesson-map-body">
                <div className="Lesson-map">
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