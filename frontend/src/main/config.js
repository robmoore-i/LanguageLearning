const portStr = process.env.REACT_APP_SERVER_PORT
const appName = process.env.REACT_APP_APP_NAME

const config = {
    localBackendOrigin: "http://localhost:" + portStr,
    appName: appName
}

export default config
