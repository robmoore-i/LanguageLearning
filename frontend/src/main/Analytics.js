// Main
import config from "./config"
import {defaultSessionIdProvider} from "./SessionIdProvider"

function defaultWebSocketFactory(url) {
    return new WebSocket(url)
}

function stubMessenger() {
    return {
        stub: true,
        send: (msg) => {
            console.log("AnalyticsStubSocket::send => " + msg)
        }
    }
}

export class Analytics {
    constructor(analyticsServerOrigin, webSocketFactory, sessionIdProvider) {
        this.ready = false
        this.messenger = stubMessenger()
        this.sessionId = sessionIdProvider.getSessionId()

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


export const defaultAnalytics = new Analytics(config.localAnalyticsOrigin, defaultWebSocketFactory, defaultSessionIdProvider)