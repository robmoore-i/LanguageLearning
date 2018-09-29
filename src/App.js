// React
import React, {Component} from 'react'
import ReactDOM from "react-dom"
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

// Service worker
import registerServiceWorker from "./registerServiceWorker"

// Resources
import globe from './images/globe.svg'
import './styles/App.css'

export function startApp() {
    ReactDOM.render(<App />, document.getElementById('root'))
    registerServiceWorker()
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/lesson-map" component={LessonMap}/>
                    </Switch>
                </BrowserRouter>
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
                <Link to="lesson-map" className="Call-to-action-btn">Get Started</Link>
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
