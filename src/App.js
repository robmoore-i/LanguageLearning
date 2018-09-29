import React, {Component} from 'react'
import { Link, Route } from 'react-router-dom';

import globe from './globe.svg'
import './App.css'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Route exact path="/" component={Home}/>
                <Route path="/lesson-map" component={LessonMap}/>
            </div>
        )
    }
}

class Home extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={globe} className="App-logo" alt="logo"/>
                <h1 className="App-title">Melange</h1>
                <h2 className="App-description">Step-by-step language lessons in the browser</h2>
                <Link to="lesson-map" className="Call-to-action-btn">
                    Get Started
                </Link>
            </header>
        )
    }
}

class LessonMap extends Component {
    render() {
        return (
            <div>
                <p>
                    This is the lesson map
                </p>
            </div>
        )
    }
}

export default App
