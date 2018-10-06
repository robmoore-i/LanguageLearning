import config from './config'

const server = {
    fetchLessonNames: () => {
        let xmlHttp = new XMLHttpRequest()
        xmlHttp.open("GET", config.backendOrigin + "/lessonnames", false)
        xmlHttp.send(null)
        return JSON.parse(xmlHttp.responseText)
    },
}

export default server