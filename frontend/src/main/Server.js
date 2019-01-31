// Main
import config from './config'
import {keySort} from './sorting'

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

export function Server(backendOrigin, fetcher) {
    return {
        fetchLessonNames: (courseName) => {
            return fetcher.getJSON(backendOrigin + "/coursemetadata?course=" + courseName)
                .then(metadata => {
                    metadata.lessonMetadata.sort(keySort("index"))
                    return {topicLessonNames: metadata.lessonMetadata.map(l => l.name)}
                })
        },

        fetchCourseMetadata: (courseName) => {
            return fetcher.getJSON(backendOrigin + "/coursemetadata?course=" + courseName)
        },

        fetchLesson: (courseName, lessonName) => {
            return fetcher.postJSON(backendOrigin + "/lesson", {courseName: courseName, lessonName: lessonName}).then(lesson => {
                lesson.questions.sort(keySort("index"))
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
