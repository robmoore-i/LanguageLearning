// Main
import config from './config'

function defaultWebSocketFactory(url) {
    return new WebSocket(url)
}

function stubAnalytics(analytics) {
    console.log("Stubbing web analytics because the connection wasn't made.")
    analytics.messenger = {
        stub: true,
        send: (msg) => {
            console.log("AnalyticsSocket::send: Stubbed => " + msg)
        }
    }
    analytics.ready = true
}

function initialiseAnalyticsFromSocket(analytics, socket) {
    socket.addEventListener('open', function (event) {
        console.log("Connection made!")
        analytics.messenger = socket
        analytics.messenger.stub = false
        analytics.ready = true
    })

    socket.addEventListener('error', () => {
        stubAnalytics(analytics)
    })

    window.llsocket = socket
}

export function Analytics(analyticsServerOrigin, webSocketFactory) {
    let analytics = {
        ready: false,
        messenger: null
    }

    try {
        let socket = webSocketFactory(analyticsServerOrigin)
        initialiseAnalyticsFromSocket(analytics, socket)
    } catch (error) {
        stubAnalytics(analytics)
    }

    analytics.recordAction = function(eventName) {
        analytics.messenger.send(eventName)
    }

    return analytics
}

export const defaultAnalytics = Analytics(config.localAnalyticsOrigin, defaultWebSocketFactory)
