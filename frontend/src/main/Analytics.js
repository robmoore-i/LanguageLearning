// Main
import config from './config'

function defaultWebSocketFactory(url) {
    return new WebSocket(url)
}

function randomSessionId() {
    let sessionIdLength = 10
    return Math.random().toString(36).substr(2, sessionIdLength)
}

function stubMessenger() {
    return {
        stub: true,
        send: (msg) => {
            console.log("AnalyticsSocket::send: Stubbed => " + msg)
        }
    }
}

export class Analytics {
    constructor(analyticsServerOrigin, webSocketFactory) {
        this.ready = false
        this.messenger = stubMessenger()
        this.sessionId = randomSessionId()

        try {
            let socket = webSocketFactory(analyticsServerOrigin)
            let analytics = this

            socket.addEventListener('open', function () {
                analytics.messenger = socket
                analytics.messenger.stub = false
                analytics.ready = true
            })

            socket.addEventListener('error', () => {
                // Stub analytics are used
            })

            window.llsocket = socket
        } catch (error) {
            // Stub analytics are used
        }
    }

    recordEvent(eventName) {
        let messageItems = []
        messageItems.push(Date.now().toString())
        messageItems.push(this.sessionId)
        messageItems.push(eventName)
        let message = messageItems.join(";")
        this.messenger.send(message)
    }
}


export const defaultAnalytics = new Analytics(config.localAnalyticsOrigin, defaultWebSocketFactory)