import config from './config'

function fetchJSON(url) {
    return fetch(url).then(response => response.json())
}

const server = {
    fetchLessonNames: () => {
        return fetchJSON(config.backendOrigin + "/lessonnames")
    },

    fetchLesson: (lessonNameInUrl) => {
        return fetchJSON(config.backendOrigin + "/lesson/" + lessonNameInUrl)
    }
}

export default server