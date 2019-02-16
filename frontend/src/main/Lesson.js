// React
import React, {Component} from "react"
// Resources
import '../styles/Lesson.css'
// Main
import {decodeUrl} from "./App"
import {QuestionTypes} from "./Question"
import MultipleChoiceQuestion, {rmExcessChoices} from "./MultipleChoiceQuestion"
import TranslationQuestion from "./TranslationQuestion"
import ReadingQuestion from "./ReadingQuestion"
import LessonStats from "./LessonStats"
import {QuestionQueue} from "./QuestionQueue"

export default class Lesson extends Component {
    constructor(props) {
        super(props)

        this.server = this.props.server
        this.courseName = this.props.courseName
        this.lessonName = decodeUrl(this.props.encodedLessonName)
        this.shuffler = this.props.shuffler

        this.state = {
            loaded: false,
            questionQueue: QuestionQueue([], 0),
            startTime: (new Date()),
            correct: 0,
            incorrect: 0
        }
    }

    componentDidMount() {
        const setState = this.setState.bind(this) // Bind 'this' reference for use within promise closure.
        this.server.fetchLesson(this.courseName, this.lessonName).then(lesson => {
            setState({
                questionQueue: QuestionQueue(lesson.questions, 0),
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

        return [
            <header className="Lesson-header" key="header">
                <h1 className="Lesson-title">{capitalisedCourseName}: {this.lessonName}</h1>
            </header>,
            this.mainContent()
        ]
    }

    mainContent() {
        if (this.state.questionQueue.completedAllQuestions()) {
            let accuracyPercentage = 100 * this.state.correct / (this.state.correct + this.state.incorrect)
            let lessonTimeSeconds = ((new Date()).getTime() - this.state.startTime.getTime()) / 1000
            return <LessonStats key="lesson-stats-component" accuracyPercentage={accuracyPercentage} lessonTime={lessonTimeSeconds} courseName={this.courseName}/>
        } else {
            return this.renderQuestion(this.state.questionQueue.currentQuestion())
        }
    }

    renderQuestion(q) {
        let completionHandlers = this.questionCompletionHandlers()
        let questionProps = {
            // Note - The uniqueness of 'key' here is crucial. If it's not unique (aka doesn't take the current question index into account),
            //        then it will not be re-rendered upon completion if two questions are the same type.
            key: "questionIndex-" + this.state.questionQueue.currentIndex(),
            q: q,
            onCorrect: completionHandlers.onCorrect,
            onIncorrect: completionHandlers.onIncorrect,
            onCompletion: completionHandlers.onCompletion,
            analytics: this.props.analytics
        }
        switch (q.type) {
            case QuestionTypes.TRANSLATION:
                let shuffledTQ = this.shuffler.shuffleTranslation(questionProps.q)
                return <TranslationQuestion
                    q={shuffledTQ}
                    key={questionProps.key}
                    onCorrect={questionProps.onCorrect}
                    onIncorrect={questionProps.onIncorrect}
                    analytics={questionProps.analytics}
                />
            case QuestionTypes.MULTIPLE_CHOICE:
                let withoutExcessChoices = rmExcessChoices(questionProps.q)
                let shuffledMCQ = this.shuffler.shuffleChoices(withoutExcessChoices)
                return <MultipleChoiceQuestion
                    q={shuffledMCQ}
                    key={questionProps.key}
                    onCorrect={questionProps.onCorrect}
                    onIncorrect={questionProps.onIncorrect}
                    analytics={questionProps.analytics}
                />
            case QuestionTypes.READING:
                return <ReadingQuestion
                    q={questionProps.q}
                    key={questionProps.key}
                    onCompletion={questionProps.onCompletion}
                    analytics={questionProps.analytics}
                />
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
                        questionQueue: state.questionQueue.advance(),
                        correct: state.correct + 1
                    }
                })
            },

            onIncorrect: () => {
                setState((state) => {
                    return {
                        questionQueue: state.questionQueue.reinsertIncorrectQuestion(),
                        incorrect: state.incorrect + 1
                    }
                })
            },

            onCompletion: (numCorrectAnswers, numIncorrectAnswers) => {
                setState((state) => {
                    return {
                        questionQueue: state.questionQueue.advance(),
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
