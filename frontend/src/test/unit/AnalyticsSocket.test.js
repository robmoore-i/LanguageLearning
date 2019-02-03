import { AnalyticsSocket } from '../../main/AnalyticsSocket'

it("On failure to establish connection, onopen gets stubbed", () => {
    let failingSocketFactory = (url) => {
        throw Error("Couldn't establish a ws connection with the server!")
    }
    let mockLog = jest.fn()

    AnalyticsSocket("testorigin", failingSocketFactory, mockLog)

    expect(mockLog).toHaveBeenCalledWith("AnalyticsSocket::onopen: Stubbed")
})

it("On failure to establish connection, send gets stubbed", () => {
    let failingSocketFactory = (url) => {
        throw Error("Couldn't establish a ws connection with the server!")
    }
    let mockLog = jest.fn()

    let analyticsSocket = AnalyticsSocket("testorigin", failingSocketFactory, mockLog)
    analyticsSocket.send("Message!")

    expect(mockLog).toHaveBeenCalledWith("AnalyticsSocket::send: Stubbed => Message!")
})

it("Opens the websocket on initialisation", () => {
    let fakeOnOpen = jest.fn()
    let socketFactory = (url) => {
        return {
            onopen: fakeOnOpen
        }
    }
    let mockLog = jest.fn()

    AnalyticsSocket("testorigin", socketFactory, mockLog)

    expect(fakeOnOpen).toHaveBeenCalled()
})