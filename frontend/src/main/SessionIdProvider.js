import {randomString} from "./random"

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
            return cache.localStorage.getItem("analytics.session")
        }
    }
}

function randomSessionId() {
    return randomString(10)
}

const cache = {
    localStorage: {
        hasItem: (key) => {
            return window.localStorage.getItem(key) !== null
        },
        getItem: (key) => {
            return window.localStorage.getItem(key)
        },
        storeItem: (key, value) => {
            window.localStorage.setItem(key, value)
        }
    }
}

export const defaultSessionIdProvider = SessionIdProvider(cache, randomSessionId)