import React, {Component} from 'react'
import globe from './globe.svg'
import './App.css'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={globe} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Melange</h1>
                    <h2 className="App-description">Step-by-step language lessons in the browser</h2>
                    <a className="Call-to-action-btn">Get Started</a>
                </header>
            </div>
        )
    }
}

export default App
