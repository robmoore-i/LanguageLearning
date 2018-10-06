const server = {
    fetchLessonNames: () => {
        let xmlHttp = new XMLHttpRequest()
        xmlHttp.open("GET", "http://localhost:8000/lessonnames", false)
        xmlHttp.send(null)
        return JSON.parse(xmlHttp.responseText)
    },
}

export default server