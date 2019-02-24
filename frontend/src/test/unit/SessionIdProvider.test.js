import {SessionIdProvider} from "../../main/SessionIdProvider"

function stubRandomSessionIdGenerator() {
    return "totally-random-session-id"
}

it("Checks localStorage for an existing sessionId", () => {
    let mockCache = {
        localStorage: {
            hasItemCalledWith: undefined,
            hasItem: (key) => {
                mockCache.localStorage.hasItemCalledWith = key
                return false
            }
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.hasItemCalledWith).toEqual("analytics.session")
})

it("If sessionId exists, get it", () => {
    let mockCache = {
        localStorage: {
            hasItem: (key) => {
                return true
            },
            getItemCalledWith: undefined,
            getItem: (key) => {
                mockCache.localStorage.getItemCalledWith = key
                return Date.now()
            }
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.getItemCalledWith).toEqual("analytics.session")
})

it("If sessionId doesn't exists, return a random session id", () => {
    let mockCache = {
        localStorage: {
            hasItem: (key) => {
                return false
            }
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("totally-random-session-id")
})