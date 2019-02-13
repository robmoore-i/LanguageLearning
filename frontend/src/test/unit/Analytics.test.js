import {Analytics, AnalyticsC} from '../../main/Analytics'

it("On failure to establish connection, messenger gets stubbed", () => {
    const failingSocketFactory = () => {
        return {
            addEventListener: (eventName, f) => {
                if (eventName === 'error') {
                    f()
                }
            }
        }
    }

    let analytics = new Analytics("testorigin", failingSocketFactory)

    expect(analytics.messenger.stub).toBe(true)
})

it("On successful connection, messenger is not stubbed", () => {
    const succeedingSocketFactory = () => {
        return {
            addEventListener: (eventName, f) => {
                if (eventName === 'open') {
                    f()
                }
            }
        }
    }

    let analytics = new Analytics("testorigin", succeedingSocketFactory)

    expect(analytics.messenger.stub).toBe(false)
})

it("Sends a semicolon delimited message of timestamp, sessionId and eventName to the server on a recordAction call", () => {
    const mockSocket = {
        addEventListener: (eventName, f) => {
            if (eventName === 'open') {
                f()
            }
        },
        sent: [],
        send: (msg) => {
            mockSocket.sent.push(msg)
        }
    }

    const succeedingSocketFactory = () => {
        return mockSocket
    }

    let analytics = new Analytics("testorigin", succeedingSocketFactory)
    analytics.sessionId = "fake-session-id"

    analytics.recordEvent("event")

    let messageParts = mockSocket.sent[0].split(";")

    let unixTimestamp = Date.now()
    expect(messageParts[0] - unixTimestamp).toBeLessThan(5)
    expect(messageParts[1]).toEqual("fake-session-id")
    expect(messageParts[2]).toEqual("event")
    expect(mockSocket.sent.length).toEqual(1)
})

it("Is initialised with an empty context", () => {
    const succeedingSocketFactory = () => {
        return {
            addEventListener: (eventName, f) => {
                if (eventName === 'open') {
                    f()
                }
            }
        }
    }

    let analytics = new Analytics("testorigin", succeedingSocketFactory)

    expect(analytics.context).toEqual({})
})