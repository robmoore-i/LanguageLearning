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
            questions: [],
            numQuestions: -1 // Cause something note-worthily weird in the case of premature usage in an accuracy calculation.
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.server.fetchLesson(this.props.lessonNameInUrl).then(lesson => {
            setState({
                lessonName: lesson.name,
                questions: lesson.questions,
                numQuestions: lesson.questions.length,
                loaded: true
            })
        })
    }

    render() {
        if (this.state.loaded) {
            return this.renderLoaded()
        } else {
            return this.renderLoading()
        }
    }

    renderLoaded() {
        let capitalise = (s => s[0].toUpperCase() + s.substring(1))
        let capitalisedCourseName = capitalise(this.courseName)

        let mainContent
        if (this.state.currentQuestionIndex >= this.state.questions.length) {
            let accuracyPercentage = 100 * this.state.numQuestions / this.state.currentQuestionIndex
            mainContent = this.renderLessonStats(accuracyPercentage, 100.0)
        } else {
            mainContent = this.renderQuestion(this.state.questions[this.state.currentQuestionIndex])
        }

        return [
            <header className="Lesson-header" key="header">
                <h1 className="Lesson-title">{capitalisedCourseName}: {this.state.lessonName}</h1>,
            </header>,
            mainContent
        ]
    }

    renderLessonStats(accuracyPercentage, lessonTime) {
        return (
            <div key="lesson-stats">
                <span id="lesson-accuracy">{"Accuracy: " + accuracyPercentage + "%"}</span>
                <span id="lesson-time">{"Time taken: " + lessonTime + " seconds"}</span>
            </div>
        )
    }

    renderQuestion(q) {
        let completionHandlers = this.questionCompletionHandlers()
        let props = {
            q: q,
            key: "questionID-" + this.state.currentQuestionIndex,
            onCorrect: completionHandlers.onCorrect,
            onIncorrect: completionHandlers.onIncorrect
        }
        switch (q.type) {
            case QuestionTypes.TRANSLATION:
                return <TranslationQuestion {... props} />
            case QuestionTypes.MULTIPLE_CHOICE:
                // Note - the uniqueness of 'key' here is crucial. If it's not unique (aka doesn't take currentQuestionIndex into account)
                //        then it will not be re-rendered upon completion if the next question is also an MCQ.
                return <MultipleChoiceQuestion {... props} />
            default:
                return <div key="sorry pal">Can't render that question pal</div>
        }
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

    renderLoading() {
        return (
            <h1>Loading {this.courseName}: {this.state.lessonName}</h1>
        )
    }
}