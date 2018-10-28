// Main
import config from './config'

const defaultFetcher = {
    getJSON: (url) => {
        return fetch(url).then(response => response.json())
    },

    postJSON: (url, body) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(response => response.json())
    }
}

function Server(backendOrigin, fetcher) {
    return {
        fetchLessonNames: () => {
            return fetcher.getJSON(backendOrigin + "/lessonnames")
        },

        fetchLesson: (lessonName) => {
            return fetcher.postJSON(backendOrigin + "/lesson", {lessonName: lessonName}).then(lesson => {
                return {
                    name: lesson.name,
                    questions: lesson.questions
                }
            })
        },

        fetchCourses: () => {
            return fetcher.getJSON(backendOrigin + "/courses")
        }
    }
}

export const LocalServer = (fetcher) => Server(config.localBackendOrigin, fetcher)
export const defaultServer = LocalServer(defaultFetcher)