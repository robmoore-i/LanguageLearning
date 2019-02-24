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
            },
            storeItem: () => {}
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.hasItemCalledWith).toEqual("analytics.session")
})

it("If sessionId exists in localStorage, get it", () => {
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
            },
            storeItem: () => {}
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("totally-random-session-id")
})

it("If sessionId doesn't exists, store the generated random session id in localStorage", () => {
    let mockCache = {
        localStorage: {
            hasItem: (key) => {
                return false
            },
            storeItemCalledWithKey: [],
            storeItemCalledWithValue: [],
            storeItem: (key, value) => {
                mockCache.localStorage.storeItemCalledWithKey.push(key)
                mockCache.localStorage.storeItemCalledWithValue.push(value)
            }
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.storeItemCalledWithKey[0]).toEqual("analytics.session")
    expect(mockCache.localStorage.storeItemCalledWithValue[0]).toEqual("totally-random-session-id")
})

it("If sessionId doesn't exists, set the new session id timeout to be 5 minutes", () => {
    let mockCache = {
        localStorage: {
            hasItem: (key) => {
                return false
            },
            storeItemCalledWithKey: [],
            storeItemCalledWithValue: [],
            storeItem: (key, value) => {
                mockCache.localStorage.storeItemCalledWithKey.push(key)
                mockCache.localStorage.storeItemCalledWithValue.push(value)
            }
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.storeItemCalledWithKey[1]).toEqual("analytics.session.timeout")
    let unixTimestamp = Date.now()
    let fiveMinutesInMilliseconds = 1000 * 60 * 5
    let expectedApproximateTimeout = unixTimestamp + fiveMinutesInMilliseconds
    expect(expectedApproximateTimeout - mockCache.localStorage.storeItemCalledWithValue[1]).toBeLessThan(5)
})