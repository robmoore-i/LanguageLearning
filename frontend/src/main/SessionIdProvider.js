export function SessionIdProvider(cache, randomSessionIdGenerator) {
    return {
        getSessionId: () => {
            if (!cache.localStorage.hasItem("analytics.session")) {
                let generatedSessionId = randomSessionIdGenerator()
                cache.localStorage.storeItem("analytics.session", generatedSessionId)
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