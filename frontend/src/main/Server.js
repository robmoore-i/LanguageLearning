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
                let qs = lesson.questions
                let rq = {type: 2, extract: "Vlad went to the kitchen and got some cake", questions: [{given: "Where did Vlad go?", answer: "Kitchen"}, {given: "What did he get there?", answer: "Cake"}]}
                qs.unshift(rq)
                return {
                    name: lesson.name,
                    questions: qs
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