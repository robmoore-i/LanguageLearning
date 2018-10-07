import config from './config'

const server = {
    fetchLessonNames: () => {
        return fetch(config.backendOrigin + "/lessonnames")
            .then(response => response.json())
    },
}

export default server