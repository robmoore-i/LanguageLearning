// React
import React, {Component} from 'react'
import ReactDOM from "react-dom"
import {BrowserRouter, Route, Switch} from 'react-router-dom'
// Service worker
import registerServiceWorker from "./registerServiceWorker"
// Resources
import '../styles/App.css'
// Components
import Home from './Home'
import Courses from './Courses'
import LessonMap from './LessonMap'
import Lesson from './Lesson'
// Injectable
import {defaultServer} from './Server'
import {defaultShuffler} from './Shuffler'
import {defaultAnalytics} from './Analytics'

export function startApp() {
    ReactDOM.render(
        <App
            server={defaultServer}
            shuffler={defaultShuffler}
            analytics={defaultAnalytics}
        />,
        document.getElementById('root')
    )
    registerServiceWorker()
}

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={this.HomeWithAnalytics}/>
                        <Route exact path="/courses" component={this.AllCourses}/>
                        <Route exact path="/courses/:course" component={this.MatchedLessonMap} />
                        <Route path="/courses/:course/:lesson" component={this.MatchedLesson} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }

    HomeWithAnalytics = () => {
        return (
            <Home
                analytics={this.props.analytics}
            />
        )
    }

    AllCourses = () => {
        return (
            <Courses
                server={this.props.server}
                analytics={this.props.analytics}
            />
        )
    }

    MatchedLessonMap = ({ match }) => {
        return (
            <LessonMap
                courseName={match.params.course}
                server={this.props.server}
                analytics={this.props.analytics}
            />
        )
    }

    MatchedLesson = ({ match }) => {
        return (
            <Lesson
                courseName={match.params.course}
                encodedLessonName={match.params.lesson}
                server={this.props.server}
                shuffler={this.props.shuffler}
                analytics={this.props.analytics}
            />
        )
    }
}
