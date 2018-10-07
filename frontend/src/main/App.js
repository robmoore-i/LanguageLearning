// React
import React, {Component} from 'react'
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Service worker
import registerServiceWorker from "./registerServiceWorker"

// Resources
import '../styles/App.css'

// Main
import server from './server'
import Home from './Home'
import Courses from './Courses'
import LessonMap from './LessonMap'
import Lesson from './Lesson'

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
                        <Route exact path="/courses" component={Courses}/>
                        <Route exact path="/courses/:course" component={MatchedLessonMap} />
                        <Route path="/courses/:course/:lesson" component={MatchedLesson} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

const MatchedLessonMap = ({ match }) => {
    return (
        <LessonMap courseName={match.params.course} server={server}/>
    )
}

const MatchedLesson = ({ match }) => {
    console.log("matched lesson", match)
    return (
        <Lesson location={"http://localhost:3000/courses/" + match.params.course + "/" + match.params.lesson} server={server}/>
    )
}