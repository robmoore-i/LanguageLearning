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

        this.state = {
            lessonName: this.props.lessonNameInUrl, // Placeholder until server response.
            loaded: false,
            currentQuestionIndex: 0,
            questions: []
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.server.fetchLesson(this.props.lessonNameInUrl).then(lesson => {
            setState({
                lessonName: lesson.name,
                questions: lesson.questions,
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
        if (this.state.currentQuestionIndex > 1) {
            return (
                <div key="ya dun">Ya Dun m8</div>
            )
        } else {
            return this.renderQuestion(this.state.questions[this.state.currentQuestionIndex])
        }
    }

    renderQuestion(q) {
        if (q.type === 0) {
            return <TranslationQuestion q={q} key="question" completionListener={this.questionCompleted()}/>
        } else if (q.type === 1) {
            return <MultipleChoiceQuestion q={q} key="question" completionListener={this.questionCompleted()} />
        } else {
            return (
                <div>Can't render that question pal</div>
            )
        }
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