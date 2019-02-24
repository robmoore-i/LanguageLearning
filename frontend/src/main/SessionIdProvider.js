export function SessionIdProvider(cache, randomSessionIdGenerator) {
    return {
        getSessionId: () => {
            let now = Date.now()
            if (!cache.localStorage.hasItem("analytics.session")) {
                let generatedSessionId = randomSessionIdGenerator()
                cache.localStorage.storeItem("analytics.session", generatedSessionId)

                let fiveMinutesInMilliseconds = 1000 * 60 * 5
                cache.localStorage.storeItem("analytics.session.timeout", now + fiveMinutesInMilliseconds)

                return generatedSessionId
            }

            if (cache.localStorage.getItem("analytics.session.timeout") < now) {
                let generatedSessionId = randomSessionIdGenerator()
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