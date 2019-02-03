// React
import React, { Component } from "react";
import { Link } from 'react-router-dom'

// Resources
import globe from '../images/globe.svg'
import '../styles/Home.css'

// Main
import config from './config'

export default class Home extends Component {
    analytics() {
        if (this.props.analytics) {
            return this.props.analytics
        } else {
            return { recordAction: () => {} }
        }
    }

    render() {
        let analytics = this.analytics()
        return (
            <header className="Home-header">
                <img src={globe} className="Home-logo" alt="logo" />
                <h1 className="Home-title">{config.appName}</h1>
                <h2 className="Home-description">Fast learning in the browser</h2>
                <Link
                    id="courses-link"
                    to="courses"
                    className="Call-to-action-btn"
                    onClick={analytics.recordAction}
                >
                    Get Started
                </Link>
            </header>
        )
    }
}
