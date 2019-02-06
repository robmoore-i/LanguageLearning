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

    analytics.recordEvent = function(eventName) {
        analytics.messenger.send(eventName)
    }

    return analytics
}

export const defaultAnalytics = Analytics(config.localAnalyticsOrigin, defaultWebSocketFactory)
