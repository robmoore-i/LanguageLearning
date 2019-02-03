// Main
import config from './config'

function defaultWebSocketFactory(url) {
    return new WebSocket(url)
}

export function AnalyticsSocket(analyticsOrigin, webSocketFactory) {
    let socket = webSocketFactory(analyticsOrigin)

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!')
    })

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data)
    })

    return {}
}

export const LocalAnalyticsSocket = (webSocketFactory) => AnalyticsSocket(config.localAnalyticsOrigin, webSocketFactory)
export const defaultAnalyticsSocket = LocalAnalyticsSocket(defaultWebSocketFactory)