import {Server} from "../../main/Server";

function TestServer(fetcher) {
    return Server("testorigin", fetcher)
}

it('Returns the sent questions when sent questions explicitly', async () => {
    let rq = {type: 2, extract: "Vlad went to the kitchen and got some cake", questions: [{given: "Where did Vlad go?", answer: "Kitchen"}, {given: "What did he get there?", answer: "Cake"}]}
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let mockFetcher = {
        postJSON: (url, body) => {
            return new Promise(resolve => resolve(
                {
                    name: "Server Stuff",
                    questions: [rq, mcq, tq]
                }
            ))
        }
    }
    let testServer = TestServer(mockFetcher)

    let fetchedLesson = undefined
    await testServer.fetchLesson("course-name", "lesson-name").then(lesson => {
        fetchedLesson = lesson
    })
    expect(fetchedLesson.name).toEqual("Server Stuff")
    expect(fetchedLesson.questions).toEqual([rq, mcq, tq])
})

it('Returns lesson names as given by server', async () => {
    let testMetadata = {
        lessonMetadata: [
            {name: "A", index: 0},
            {name: "B", index: 1},
            {name: "C", index: 2}
        ]
    }

    let mockFetcher = {
        getJSON: (url) => {
            return new Promise(resolve => resolve(testMetadata))
        }
    }
    let testServer = TestServer(mockFetcher)

    let fetchedLessonNames = undefined
    await testServer.fetchLessonNames("courseName_doesn't_matter").then(lessonNames => {
        fetchedLessonNames = lessonNames
    })
    expect(fetchedLessonNames).toEqual({topicLessonNames: ["A", "B", "C"]})
})

it('Returns lesson names ordered by index', async () => {
    let testMetadata = {
        lessonMetadata: [
            {name: "B", index: 1},
            {name: "C", index: 2},
            {name: "A", index: 0}
        ]
    }

    let mockFetcher = {
        getJSON: (url) => {
            return new Promise(resolve => resolve(testMetadata))
        }
    }
    let testServer = TestServer(mockFetcher)

    let fetchedLessonNames = undefined
    await testServer.fetchLessonNames("courseName_doesn't_matter").then(lessonNames => {
        fetchedLessonNames = lessonNames
    })
    expect(fetchedLessonNames).toEqual({topicLessonNames: ["A", "B", "C"]})
})

it('Returns the questions of a lesson ordered by index', async () => {
    let rq = {index: 2, type: 2, extract: "Vlad went to the kitchen and got some cake", questions: [{given: "Where did Vlad go?", answer: "Kitchen"}, {given: "What did he get there?", answer: "Cake"}]}
    let mcq = {index: 0, type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {index: 1, type: 0, given: "hello", answer: "გამარჯობა"}
    let mockFetcher = {
        postJSON: (url, body) => {
            return new Promise(resolve => resolve(
                {
                    name: "Server Stuff",
                    questions: [rq, mcq, tq]
                }
            ))
        }
    }
    let testServer = TestServer(mockFetcher)

    let fetchedLesson = undefined
    await testServer.fetchLesson("course-name", "lesson-name").then(lesson => {
        fetchedLesson = lesson
    })
    expect(fetchedLesson.name).toEqual("Server Stuff")
    expect(fetchedLesson.questions).toEqual([mcq, tq, rq])
})

it('Sends the course name and lesson name when fetching a lesson from the server', async () => {
    let mockFetcher = {
        postJSONCalledWithBody: null,
        postJSON: (url, body) => {
            mockFetcher.postJSONCalledWithBody = body
            return new Promise(resolve => resolve({}))
        }
    }
    
    TestServer(mockFetcher).fetchLesson("course-name", "lesson-name")

    expect(mockFetcher.postJSONCalledWithBody).toEqual({courseName: "course-name", lessonName: "lesson-name"})
})