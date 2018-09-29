// React
import React, {Component} from 'react'
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Service worker
import registerServiceWorker from "./registerServiceWorker"

// Resources
import '../styles/App.css'

// Main
import Home from './Home'
import LessonMap from './LessonMap'

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
                        <Route path="/lesson-map" component={LessonMap}/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}