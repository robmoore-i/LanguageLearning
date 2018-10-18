// React
import React, {Component} from "react"
// Resources
import '../styles/Lesson.css'
// Main
import MultipleChoiceQuestion from "./MultipleChoiceQuestion"
import TranslationQuestion from "./TranslationQuestion"

export default class Lesson extends Component {
    constructor(props) {
        super(props)

        this.server = this.props.server
        this.courseName = this.props.courseName

        let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
        let TQ = <TranslationQuestion q={tq} key="question"/>

        let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
        let MCQ = <MultipleChoiceQuestion q={mcq} key="question" completionListener={this.questionCompleted()} />

        this.questions = [MCQ, TQ]

        this.state = {
            lessonName: this.props.lessonNameInUrl, // Placeholder until server response.
            loaded: false,
            currentQuestionIndex: 0
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

    questionCompleted() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback
        return () => {
            setState((state) => {
                return {currentQuestionIndex: state.currentQuestionIndex + 1}
            })
        }
    }

    currentQuestion() {
        return this.questions[this.state.currentQuestionIndex]
    }

    renderLoading() {
        return (
            <h1>Loading {this.courseName}: {this.state.lessonName}</h1>
        )
    }

    renderLoaded() {
        let capitalise = (s => s[0].toUpperCase() + s.substring(1))
        let capitalisedCourseName = capitalise(this.courseName)
        return [
            <header className="Lesson-header" key="header">
                <h1 className="Lesson-title">{capitalisedCourseName}: {this.state.lessonName}</h1>,
            </header>,
            this.currentQuestion()
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