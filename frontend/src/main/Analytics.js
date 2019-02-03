// Main
import config from './config'

function defaultWebSocketFactory(url) {
    try {
        return new WebSocket(url)
    } catch (err) {
        return new WebSocket("ws://localhost:5000")
    }
}

function initialiseAnalytics(url, webSocketFactory, analytics) {
    let socket = webSocketFactory(url)
    
    socket.addEventListener('open', function (event) {
        console.log("Connection made!")
        analytics.messenger = socket
        analytics.messenger.stub = false
        analytics.ready = true
    })

    socket.addEventListener('error', () => {
        console.log("Stubbing web analytics because the connection wasn't made.")
        analytics.messenger = {
            stub: true,
            onopen: (f) => {
                console.log("AnalyticsSocket::onopen: Stubbed")
            },
            send: (msg) => {
                console.log("AnalyticsSocket::send: Stubbed => " + msg)
            }
        }
        analytics.ready = true
    })

    return socket
}

export function Analytics(analyticsServerOrigin, webSocketFactory) {
    let analytics = {
        ready: false,
        messenger: null
    }

    let socket = initialiseAnalytics(analyticsServerOrigin, webSocketFactory, analytics)

    window.llsocket = socket

    return analytics
}

export const defaultAnalytics = Analytics(config.localAnalyticsOrigin, defaultWebSocketFactory)
