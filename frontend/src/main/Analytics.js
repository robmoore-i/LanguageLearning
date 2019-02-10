// Main
import config from './config'

function defaultWebSocketFactory(url) {
    return new WebSocket(url)
}

function stubAnalytics(analytics) {
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
        analytics.messenger = socket
        analytics.messenger.stub = false
        analytics.ready = true
    })

    socket.addEventListener('error', () => {
        stubAnalytics(analytics)
    })

    window.llsocket = socket
}

function randomSessionId(){
    return Math.random().toString(36).substr(2, 10)
}

export function Analytics(analyticsServerOrigin, webSocketFactory) {
    let analytics = {
        ready: false,
        messenger: null,
        sessionId: randomSessionId()
    }

    try {
        let socket = webSocketFactory(analyticsServerOrigin)
        initialiseAnalyticsFromSocket(analytics, socket)
    } catch (error) {
        stubAnalytics(analytics)
    }

    analytics.recordEvent = function(eventName) {
        let messageItems = []
        messageItems.push(Date.now().toString())
        messageItems.push(analytics.sessionId)
        messageItems.push(eventName)
        let message = messageItems.join(";")
        analytics.messenger.send(message)
    }

    return analytics
}

export const defaultAnalytics = Analytics(config.localAnalyticsOrigin, defaultWebSocketFactory)
