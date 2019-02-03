// Main
import config from './config'

function defaultWebSocketFactory(url) {
    return new WebSocket(url)
}

function initialiseAnalyticsSocket(analyticsServerOrigin, webSocketFactory, clog) {
    try {
        return webSocketFactory(analyticsServerOrigin)
    } catch(err) {
        clog("Stubbing web analytics because the connection wasn't made.")
        clog("Raw error: " + err)
        return {
            onopen: (f) => {
                clog("AnalyticsSocket::onopen: Stubbed")
            },
            send: (msg) => {
                clog("AnalyticsSocket::send: Stubbed => " + msg)
            }
        }
    }
}

export function AnalyticsSocket(analyticsServerOrigin, webSocketFactory, clog) {
    let socket = initialiseAnalyticsSocket(analyticsServerOrigin, webSocketFactory, clog)

    socket.onopen(function (event) {
        socket.send('Hello Server!')
    })

    return socket
}

export const ConsoleLoggedAnalyticsSocket = (analyticsServerOrigin, webSocketFactory) => AnalyticsSocket(analyticsServerOrigin, webSocketFactory, console.log)
export const LocalAnalyticsSocket = (webSocketFactory) => ConsoleLoggedAnalyticsSocket(config.localAnalyticsOrigin, webSocketFactory)
export const defaultAnalyticsSocket = LocalAnalyticsSocket(defaultWebSocketFactory)