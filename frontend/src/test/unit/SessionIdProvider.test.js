import {SessionIdProvider} from "../../main/SessionIdProvider"

it("Checks localStorage for an existing sessionId", () => {
    let mockCache = {
        localStorage: {
            hasItemCalledWith: undefined,
            hasItem: (key) => {
                mockCache.localStorage.hasItemCalledWith = key
                return false
            },
            getItem: () => {}
        }
    }
    let sessionIdProvider = SessionIdProvider(mockCache)

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
    let sessionIdProvider = SessionIdProvider(mockCache)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.getItemCalledWith).toEqual("analytics.session")
})