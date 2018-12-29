// React
import React, {Component} from "react"

// Resources
import '../styles/Lesson.css'

// Main
import {decodeUrl} from "./App"
import {QuestionTypes} from "./Question"
import MultipleChoiceQuestion from "./MultipleChoiceQuestion"
import TranslationQuestion from "./TranslationQuestion"
import ReadingQuestion from "./ReadingQuestion"
import LessonStats from "./LessonStats"

export default class Lesson extends Component {
    constructor(props) {
        super(props)

        this.server = this.props.server
        this.courseName = this.props.courseName
        this.lessonName = decodeUrl(this.props.encodedLessonName)
        this.shuffler = this.props.shuffler

        this.state = {
            loaded: false,
            currentQuestionIndex: 0,
            questions: [],
            numQuestions: -1, // -1 will cause something note-worthily weird in the case of premature usage in an accuracy calculation.
            startTime: (new Date()),
            correct: 0,
            incorrect: 0
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.server.fetchLesson(this.lessonName).then(lesson => {
            setState({
                questions: lesson.questions,
                numQuestions: lesson.questions.length,
                loaded: true,
                startTime: (new Date())
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
            let accuracyPercentage = 100 * this.state.correct / (this.state.correct + this.state.incorrect)
            let lessonTimeSeconds = ((new Date()).getTime() - this.state.startTime.getTime()) / 1000
            mainContent = <LessonStats key="lesson-stats-component" accuracyPercentage={accuracyPercentage} lessonTime={lessonTimeSeconds} courseName={this.courseName} />
        } else {
            mainContent = this.renderQuestion(this.state.questions[this.state.currentQuestionIndex])
        }

        return [
            <header className="Lesson-header" key="header">
                <h1 className="Lesson-title">{capitalisedCourseName}: {this.lessonName}</h1>
            </header>,
            mainContent
        ]
    }

    renderQuestion(q) {
        let completionHandlers = this.questionCompletionHandlers()
        let questionProps = {
            // Note - The uniqueness of 'key' here is crucial. If it's not unique (aka doesn't take currentQuestionIndex into account),
            //        then it will not be re-rendered upon completion if two questions are the same type.
            key: "questionIndex-" + this.state.currentQuestionIndex,
            q: q,
            onCorrect: completionHandlers.onCorrect,
            onIncorrect: completionHandlers.onIncorrect,
            onCompletion: completionHandlers.onCompletion
        }
        switch (q.type) {
            case QuestionTypes.TRANSLATION:
                return <TranslationQuestion
                    q={this.shuffler.shuffleTranslation(questionProps.q)}
                    key={questionProps.key}
                    onCorrect={questionProps.onCorrect}
                    onIncorrect={questionProps.onIncorrect}
                    onCompletion={questionProps.onCompletion} />
            case QuestionTypes.MULTIPLE_CHOICE:
                return <MultipleChoiceQuestion
                    q={this.shuffler.shuffleChoices(questionProps.q)}
                    key={questionProps.key}
                    onCorrect={questionProps.onCorrect}
                    onIncorrect={questionProps.onIncorrect}
                    onCompletion={questionProps.onCompletion} />
            case QuestionTypes.READING:
                return <ReadingQuestion
                    q={questionProps.q}
                    key={questionProps.key}
                    onCompletion={questionProps.onCompletion} />
            default:
                return <div key="sorry pal">Can't render that question pal</div>
        }
    }

    questionCompletionHandlers() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within callback
        return {
            onCorrect: () => {
                setState((state) => {
                    return {
                        currentQuestionIndex: state.currentQuestionIndex + 1,
                        correct: state.correct + 1
                    }
                })
            },

            onIncorrect: () => {
                setState((state) => {
                    return {
                        currentQuestionIndex: state.currentQuestionIndex + 1,
                        questions: state.questions.concat([state.questions[state.currentQuestionIndex]]),
                        incorrect: state.incorrect + 1
                    }
                })
            },

            onCompletion: (numCorrectAnswers, numIncorrectAnswers) => {
                setState((state) => {
                    return {
                      currentQuestionIndex: state.currentQuestionIndex + 1,
                      correct: state.correct + numCorrectAnswers,
                      incorrect: state.incorrect + numIncorrectAnswers
                    }
                })
            }
        }
    }

    renderLoading() {
        return (
            <h1>Loading {this.courseName}: {this.lessonName}</h1>
        )
    }
}
