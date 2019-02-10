import { Analytics } from '../../main/Analytics'

it("On failure to establish connection, messenger gets stubbed", () => {
    const failingSocketFactory = (url) => {
        return {
            addEventListener: (eventName, f) => {
                if (eventName === 'error') {
                    f()
                }
            }
        }
    }

    let analytics = Analytics("testorigin", failingSocketFactory)

    expect(analytics.messenger.stub).toBe(true)
})

it("On successful connection, messenger is not stubbed", () => {
    const succeedingSocketFactory = (url) => {
        return {
            addEventListener: (eventName, f) => {
                if (eventName === 'open') {
                    f()
                }
            }
        }
    }

    let analytics = Analytics("testorigin", succeedingSocketFactory)

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
    
    const succeedingSocketFactory = (url) => {
        return mockSocket
    }

    let analytics = Analytics("testorigin", succeedingSocketFactory)
    analytics.sessionId = "fake-session-id"

    analytics.recordEvent("event")

    let messageParts = mockSocket.sent[0].split(";")

    let unixTimestamp = Date.now()
    expect(messageParts[0] - unixTimestamp).toBeLessThan(5)
    expect(messageParts[1]).toEqual("fake-session-id")
    expect(messageParts[2]).toEqual("event")
    expect(mockSocket.sent.length).toEqual(1)
})