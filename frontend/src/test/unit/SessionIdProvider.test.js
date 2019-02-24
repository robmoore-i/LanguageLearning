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
                    return mockCacheBuilder.hasItemReturnsValue
                },

                getItemCalls: 0,
                getItemCalledWith: undefined,
                getItem: (key) => {
                    mockCacheBuilder.mockCache.localStorage.getItemCalledWith = key
                    let item = mockCacheBuilder.getItemReturnsValues[mockCacheBuilder.mockCache.localStorage.getItemCalls]
                    mockCacheBuilder.mockCache.localStorage.getItemCalls += 1
                    return item
                },

                storeItemCalledWithKey: [],
                storeItemCalledWithValue: [],
                storeItem: (key, value) => {
                    mockCacheBuilder.mockCache.localStorage.storeItemCalledWithKey.push(key)
                    mockCacheBuilder.mockCache.localStorage.storeItemCalledWithValue.push(value)
                }
            }
        },

        hasItemReturnsValue: undefined,
        hasItemReturns: (bool) => {
            mockCacheBuilder.hasItemReturnsValue = bool
            return mockCacheBuilder
        },

        getItemReturnsValues: [],
        getItemReturns: (item) => {
            mockCacheBuilder.getItemReturnsValues.push(item)
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
    let mockCache = MockCacheBuilder().hasItemReturns(false).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.hasItemCalledWith).toEqual("analytics.session")
})

it("If sessionId exists in localStorage, get it", () => {
    let mockCache = MockCacheBuilder().hasItemReturns(true).getItemReturns(Date.now()).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.getItemCalledWith).toEqual("analytics.session")
})

it("If sessionId doesn't exists, return a random session id", () => {
    let mockCache = MockCacheBuilder().hasItemReturns(false).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("totally-random-session-id")
})

it("If sessionId doesn't exists, store the generated random session id in localStorage", () => {
    let mockCache = MockCacheBuilder().hasItemReturns(false).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.storeItemCalledWithKey[0]).toEqual("analytics.session")
    expect(mockCache.localStorage.storeItemCalledWithValue[0]).toEqual("totally-random-session-id")
})

it("If sessionId doesn't exists, set the new session id timeout to be 5 minutes", () => {
    let mockCache = MockCacheBuilder().hasItemReturns(false).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.storeItemCalledWithKey[1]).toEqual("analytics.session.timeout")
    let unixTimestamp = Date.now()
    let fiveMinutesInMilliseconds = 1000 * 60 * 5
    let expectedApproximateTimeout = unixTimestamp + fiveMinutesInMilliseconds
    expect(expectedApproximateTimeout - mockCache.localStorage.storeItemCalledWithValue[1]).toBeLessThan(20)
})

it("If existing sessionId has timed out, create a generated random session id", () => {
    let fiveSecondsInMilliseconds = 1000 * 5
    let fiveSecondsAgo = Date.now() - fiveSecondsInMilliseconds
    let mockCache = MockCacheBuilder().hasItemReturns(true).getItemReturns(fiveSecondsAgo).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("totally-random-session-id")
})

it("If existing sessionId has no corresponding timeout entry, create a new generated random session id", () => {
    let mockCache = MockCacheBuilder().hasItemReturns(true).getItemReturns(undefined).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("totally-random-session-id")
})

it("Resets the timeout if the session id hasn't timed out", () => {
    let twoMinutesInMilliseconds = 1000 * 60 * 2
    let inTwoMinutesTime = Date.now() + twoMinutesInMilliseconds
    let mockCache = MockCacheBuilder().hasItemReturns(true).getItemReturns(inTwoMinutesTime).build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.storeItemCalledWithKey[0]).toEqual("analytics.session.timeout")
    let unixTimestamp = Date.now()
    let fiveMinutesInMilliseconds = 1000 * 60 * 5
    let expectedApproximateTimeout = unixTimestamp + fiveMinutesInMilliseconds
    expect(expectedApproximateTimeout - mockCache.localStorage.storeItemCalledWithValue[0]).toBeLessThan(20)
})

it("Returns unexpired tokens unchanged", () => {
    let twoMinutesInMilliseconds = 1000 * 60 * 2
    let inTwoMinutesTime = Date.now() + twoMinutesInMilliseconds
    let mockCache = MockCacheBuilder().hasItemReturns(true).getItemReturns(inTwoMinutesTime).getItemReturns("existing-session-id").build()
    let sessionIdProvider = SessionIdProvider(mockCache, stubRandomSessionIdGenerator)

    let sessionId = sessionIdProvider.getSessionId()

    expect(sessionId).toEqual("existing-session-id")
})