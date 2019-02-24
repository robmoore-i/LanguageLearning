import {SessionIdProvider} from "../../main/SessionIdProvider"

function stubRandomSessionIdGenerator() {
    return "totally-random-session-id"
}

function MockCacheBuilder() {
    let mockCacheBuilder = {
        mockCache: {
            localStorage: {
                hasItemCalledWith: undefined,
                hasItem: (key) => {
                    mockCacheBuilder.mockCache.localStorage.hasItemCalledWith = key
                    return mockCacheBuilder.hasItemReturns
                },

                getItemCalledWith: undefined,
                getItem: (key) => {
                    mockCacheBuilder.mockCache.localStorage.getItemCalledWith = key
                    return mockCacheBuilder.getItemReturns
                },

                storeItemCalledWithKey: [],
                storeItemCalledWithValue: [],
                storeItem: (key, value) => {
                    mockCacheBuilder.mockCache.localStorage.storeItemCalledWithKey.push(key)
                    mockCacheBuilder.mockCache.localStorage.storeItemCalledWithValue.push(value)
                }
            }
        },

        hasItemReturns: undefined,
        hasItemReturns: (bool) => {
            mockCacheBuilder.hasItemReturns = bool
            return mockCacheBuilder
        },

        getItemReturns: undefined,
        getItemReturns: (bool) => {
            mockCacheBuilder.getItemReturns = bool
            return mockCacheBuilder
        },

        build: () => {
            return mockCacheBuilder.mockCache
        }
    }
    return mockCacheBuilder
}

function cacheMockingStoreItem() {
    return MockCacheBuilder().hasItemReturns(false).build()
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
            },
            storeItem: () => {}
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
    let mockCache = cacheMockingStoreItem()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.storeItemCalledWithKey[0]).toEqual("analytics.session")
    expect(mockCache.localStorage.storeItemCalledWithValue[0]).toEqual("totally-random-session-id")
})

it("If sessionId doesn't exists, set the new session id timeout to be 5 minutes", () => {
    let mockCache = cacheMockingStoreItem()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.storeItemCalledWithKey[1]).toEqual("analytics.session.timeout")
    let unixTimestamp = Date.now()
    let fiveMinutesInMilliseconds = 1000 * 60 * 5
    let expectedApproximateTimeout = unixTimestamp + fiveMinutesInMilliseconds
    expect(expectedApproximateTimeout - mockCache.localStorage.storeItemCalledWithValue[1]).toBeLessThan(20)
})

it("If existing sessionId has timed out, create a generated random session id", () => {
    let mockCache = {
        localStorage: {
            hasItem: () => true,
            getItem: () => {
                let fiveSecondsInMilliseconds = 1000 * 5
                let fiveSecondsAgo = Date.now() - fiveSecondsInMilliseconds
                return fiveSecondsAgo
            },
            storeItem: () => {}
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("totally-random-session-id")
})

it("If existing sessionId has no corresponding timeout entry, create a new generated random session id", () => {
    let mockCache = {
        localStorage: {
            hasItem: () => true,
            getItem: () => {
                return undefined
            },
            storeItem: () => {}
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("totally-random-session-id")
})

it("Resets the timeout if the session id hasn't timed out", () => {
    let mockCache = {
        localStorage: {
            hasItem: (key) => {
                return true
            },
            getItem: () => {
                let twoMinutesInMilliseconds = 1000 * 60 * 2
                let inTwoMinutesTime = Date.now() + twoMinutesInMilliseconds
                return inTwoMinutesTime
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

    expect(mockCache.localStorage.storeItemCalledWithKey[0]).toEqual("analytics.session.timeout")
    let unixTimestamp = Date.now()
    let fiveMinutesInMilliseconds = 1000 * 60 * 5
    let expectedApproximateTimeout = unixTimestamp + fiveMinutesInMilliseconds
    expect(expectedApproximateTimeout - mockCache.localStorage.storeItemCalledWithValue[0]).toBeLessThan(20)
})