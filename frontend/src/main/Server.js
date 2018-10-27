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
            return fetcher.postJSON(backendOrigin + "/lesson", {"lessonName": lessonName}).then(lesson => {
                if ("productionInputsPairs" in lesson) {
                    let productions = lesson.productionInputsPairs.productions
                    let inputs = lesson.productionInputsPairs.inputs

                    if (productions.length !== inputs.length) {
                        throw new Error("Lesson.componentDidMount: Productions and Inputs from server have unequal lengths - cannot make questions")
                    }

                    let questions = []

                    for (let i = 0; i < inputs.length; i++) {
                        const input = inputs[i];
                        const production = productions[i]
                        for (let j = 0; j < input.length; j++) {
                            questions.push(production.using(input[j]))
                        }
                    }
                    return {
                        name: lesson.name,
                        questions: questions
                    }
                } else {
                    return {
                        name: lesson.name,
                        questions: lesson.questions
                    }
                }
            })
        },

        fetchCourseNames: () => {
            return new Promise(resolve => resolve(["Georgian", "German"]))
        }
    }
}

export const LocalServer = (fetcher) => Server(config.localBackendOrigin, fetcher)
export const defaultServer = LocalServer(defaultFetcher)