import React, {Component} from 'react'
import georgianFlag from './georgianFlag.svg'
import './App.css'

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={georgianFlag} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Kartvelang</h1>
                    <h2 className="App-description">Step-by-step Georgian lessons in the browser</h2>
                    <a className="Call-to-action-btn">Get Started</a>
                </header>
            </div>
        )
    }
}

export default App
