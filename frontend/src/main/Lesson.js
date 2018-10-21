// React
import React, {Component} from "react"
// Resources
import '../styles/Lesson.css'
// Main
import MultipleChoiceQuestion from "./MultipleChoiceQuestion"
import TranslationQuestion from "./TranslationQuestion"
import {QuestionTypes} from "./Question";

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

    questionCompletionHandlers() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback
        return {
            onCorrect: () => {
                setState((state) => {return {currentQuestionIndex: state.currentQuestionIndex + 1}})
            },

            onIncorrect: () => {
                setState((state) => {
                    return {
                        currentQuestionIndex: state.currentQuestionIndex + 1,
                        questions: state.questions.concat([state.questions[state.currentQuestionIndex]])
                    }
                })
            }
        }
    }

    currentQuestion() {
        let maxIndex = this.state.questions.length - 1
        if (this.state.currentQuestionIndex > maxIndex) {
            return <div key="ya dun">Ya Dun m8</div>
        } else {
            return this.renderQuestion(this.state.questions[this.state.currentQuestionIndex])
        }
    }

    renderQuestion(q) {
        let completionHandlers = this.questionCompletionHandlers()
        switch (q.type) {
            case QuestionTypes.TRANSLATION:
                return <TranslationQuestion q={q} key="question" onCorrect={completionHandlers.onCorrect} onIncorrect={completionHandlers.onIncorrect} />
            case QuestionTypes.MULTIPLE_CHOICE:
                return <MultipleChoiceQuestion q={q} key="question" onCorrect={completionHandlers.onCorrect} onIncorrect={completionHandlers.onIncorrect} />
            default:
                return <div key="sorry pal">Can't render that question pal</div>
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