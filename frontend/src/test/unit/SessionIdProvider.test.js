import {SessionIdProvider} from "../../main/SessionIdProvider"

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
    let sessionIdProvider = SessionIdProvider(mockCache)

    sessionIdProvider.getSessionId()

    expect(mockCache.localStorage.hasItemCalledWith).toEqual("analytics.session.id")
})