// React
import React, {Component} from 'react'
import ReactDOM from "react-dom"
import {BrowserRouter, Route, Switch} from 'react-router-dom'
// Service worker
import registerServiceWorker from "./registerServiceWorker"
// Resources
import '../styles/App.css'
// Main
import {defaultServer} from './Server'
import Home from './Home'
import Courses from './Courses'
import LessonMap from './LessonMap'
import Lesson from './Lesson'
import {defaultShuffler} from './Shuffler'

export function startApp() {
    ReactDOM.render(<App />, document.getElementById('root'))
    registerServiceWorker()
}

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/courses" component={AllCourses}/>
                        <Route exact path="/courses/:course" component={MatchedLessonMap} />
                        <Route path="/courses/:course/:lesson" component={MatchedLesson} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

const AllCourses = () => {
    return (
        <Courses server={defaultServer} />
    )
}

const MatchedLessonMap = ({ match }) => {
    return (
        <LessonMap courseName={match.params.course} server={defaultServer}/>
    )
}

const MatchedLesson = ({ match }) => {
    return (
        <Lesson courseName={match.params.course} encodedLessonName={match.params.lesson} server={defaultServer} shuffler={defaultShuffler}/>
    )
}

export function encodeUrl(string) {
    return encodeURIComponent(string.split(" ").join("_"))
}

export function decodeUrl(url) {
    return decodeURIComponent(url.split("_").join(" "))
}
