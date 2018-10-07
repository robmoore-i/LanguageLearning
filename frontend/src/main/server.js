import config from './config'

const server = {
    fetchLessonNames: () => {
        return fetch(config.backendOrigin + "/lessonnames")
            .then(response => response.json())
    },

    fetchLesson: (lessonNameInUrl) => {
        return fetch(config.backendOrigin + "/lesson/" + lessonNameInUrl)
            .then(response => response.json())
    }
}

export default server