const portStr = process.env.REACT_APP_SERVER_PORT
const analyticsPortStr = process.env.REACT_APP_ANALYTICS_PORT
const appName = process.env.REACT_APP_APP_NAME

const config = {
    localBackendOrigin: "http://localhost:" + portStr,
    localAnalyticsOrigin: "ws://localhost:" + analyticsPortStr,
    appName: appName
}

export default config
