export function SessionIdProvider(cache, randomSessionIdGenerator) {
    const fiveMinutesInMilliseconds = 1000 * 60 * 5

    function useNewToken(currentTime) {
        let generatedSessionId = randomSessionIdGenerator()
        cache.localStorage.storeItem("analytics.session", generatedSessionId)
        cache.localStorage.storeItem("analytics.session.timeout", currentTime + fiveMinutesInMilliseconds)

        return generatedSessionId
    }

    return {
        getSessionId: () => {
            let currentTime = Date.now()
            if (!cache.localStorage.hasItem("analytics.session")) {
                return useNewToken(currentTime)
            }

            let timeout = cache.localStorage.getItem("analytics.session.timeout")
            if (timeout === undefined || timeout < currentTime) {
                return useNewToken(currentTime)
            }

            cache.localStorage.storeItem("analytics.session.timeout", currentTime + fiveMinutesInMilliseconds)

            cache.localStorage.getItem("analytics.session")
            return ""
        }
    }
}

export function randomSessionId() {
    let sessionIdLength = 10
    return Math.random().toString(36).substr(2, sessionIdLength)
}

export const defaultSessionIdProvider = {
    getSessionId: () => {
        return randomSessionId()
    }
}