export function SessionIdProvider(cache) {
    return {
        getSessionId: () => {
            cache.localStorage.hasItem("analytics.session.id")
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