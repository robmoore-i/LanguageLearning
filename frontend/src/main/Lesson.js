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
            numQuestions: -1, // Cause something note-worthily weird in the case of premature usage in an accuracy calculation.
            startTime: (new Date())
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.

        if (this.props.fromProductions) {
            this.server.fetchLessonProductions(this.props.lessonNameInUrl).then(lesson => {
                let productions = lesson.productionInputsPairs.productions
                let inputs = lesson.productionInputsPairs.inputs

                let q1 = productions[0].using(inputs[0][0])
                let q2 = productions[0].using(inputs[0][1])

                let questions = [q1, q2]

                setState({
                    lessonName: lesson.name,
                    questions: questions,
                    numQuestions: questions.length,
                    loaded: true,
                    startTime: (new Date())
                })
            })
        } else {
            this.server.fetchLesson(this.props.lessonNameInUrl).then(lesson => {
                setState({
                    lessonName: lesson.name,
                    questions: lesson.questions,
                    numQuestions: lesson.questions.length,
                    loaded: true,
                    startTime: (new Date())
                })
            })
        }
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
            let lessonTimeSeconds = ((new Date()).getTime() - this.state.startTime.getTime()) / 1000
            mainContent = this.renderLessonStats(accuracyPercentage, lessonTimeSeconds)
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
        let accuracyTo1dpString = (Math.round(10 * accuracyPercentage) / 10).toString()
        return (
            <div id="lesson-stats" key="lesson-stats">
                <br />
                <div id="lesson-accuracy">
                    <span>Accuracy: </span>
                    <span id="lesson-accuracy-number">{accuracyTo1dpString + "%"}</span>
                </div>
                <br />
                <div id="lesson-time">
                    <span>Time taken: </span>
                    <span id="lesson-time-number">{lessonTime + " seconds"}</span>
                </div>
                <br />
                <a id="back-to-lessonmap-button" href={"/courses/" + this.courseName}>Back to Lesson Map</a>
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