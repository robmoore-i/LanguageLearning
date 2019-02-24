export function SessionIdProvider(cache, randomSessionIdGenerator) {
    function useNewToken(currentTime) {
        let generatedSessionId = randomSessionIdGenerator()
        cache.localStorage.storeItem("analytics.session", generatedSessionId)

        let fiveMinutesInMilliseconds = 1000 * 60 * 5
        cache.localStorage.storeItem("analytics.session.timeout", currentTime + fiveMinutesInMilliseconds)

        return generatedSessionId
    }

    return {
        getSessionId: () => {
            let now = Date.now()
            if (!cache.localStorage.hasItem("analytics.session")) {
                return useNewToken(now)
            }

            let timeout = cache.localStorage.getItem("analytics.session.timeout")
            if (timeout === undefined || timeout < now) {
                return useNewToken(now)
            }

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