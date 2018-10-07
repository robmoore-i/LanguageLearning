import config from './config'

const server = {
    fetchLessonNames: () => {
        return fetch(config.backendOrigin + "/lessonnames")
            .then(response => response.json())
    },

    fetchLesson: (lessonNameInUrl) => {
        return new Promise(resolve => resolve({name: "Hello!"}))
    }
}

export default server