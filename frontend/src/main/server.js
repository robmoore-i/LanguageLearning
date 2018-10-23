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

const DefaultFetcher = {
    fetchJSON: (url) => {
        return fetch(url).then(response => response.json())
    }
}

export function Server(fetcher) {
    return {
        fetchLessonNames: () => {
            return fetcher.fetchJSON(config.backendOrigin + "/lessonnames")
        },

        fetchLesson: (lessonNameInUrl) => {
            return fetcher.fetchJSON(config.backendOrigin + "/lesson/" + lessonNameInUrl).then(lesson => {
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
        }
    }
}

export const DefaultServer = Server(DefaultFetcher)