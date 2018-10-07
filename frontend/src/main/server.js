import config from './config'

const server = {
    fetchLessonNames: () => {
        return fetch(config.backendOrigin + "/lessonnames")
            .then(response => response.json())
    },

    fetchLesson: () => {

    }
}

export default server