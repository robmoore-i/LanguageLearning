import { Analytics } from '../../main/Analytics'

it("On failure to establish connection, messenger gets stubbed", () => {
    const failingSocketFactory = (url) => {
        return {
            addEventListener: (eventName, f) => {
                if (eventName === 'error') {
                    f()
                }
            }
        }
    }

    let analytics = Analytics("testorigin", failingSocketFactory)

    expect(analytics.messenger.stub).toBe(true)
})

it("On successful connection, messenger is not stubbed", () => {
    const succeedingSocketFactory = (url) => {
        return {
            addEventListener: (eventName, f) => {
                if (eventName === 'open') {
                    f()
                }
            }
        }
    }

    let analytics = Analytics("testorigin", succeedingSocketFactory)

    expect(analytics.messenger.stub).toBe(false)
})