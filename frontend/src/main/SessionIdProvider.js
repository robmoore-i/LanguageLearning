export function SessionIdProvider(cache, randomSessionIdGenerator) {
    return {
        getSessionId: () => {
            if (!cache.localStorage.hasItem("analytics.session")) {
                let generatedSessionId = randomSessionIdGenerator()
                cache.localStorage.storeItem("analytics.session", generatedSessionId)

                let fiveMinutesInMilliseconds = 1000 * 60 * 5
                cache.localStorage.storeItem("analytics.session.timeout", Date.now() + fiveMinutesInMilliseconds)

                return generatedSessionId
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