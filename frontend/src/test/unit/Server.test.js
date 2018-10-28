import {LocalServer} from "../../main/Server";

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
    let testServer = LocalServer(mockFetcher)

    let fetchedLesson = undefined
    await testServer.fetchLesson("ayylmao").then(lesson => {
        fetchedLesson = lesson
    })
    expect(fetchedLesson.name).toEqual("Server Stuff")
    expect(fetchedLesson.questions).toEqual([rq, mcq, tq])
})

it('Returns lesson names as given by server', async () => {
    let mockFetcher = {
        getJSON: (url) => {
            return new Promise(resolve => resolve(["A", "B", "C"]))
        }
    }
    let testServer = LocalServer(mockFetcher)

    let fetchedLessonNames = undefined
    await testServer.fetchLessonNames().then(lessonNames => {
        fetchedLessonNames = lessonNames
    })
    expect(fetchedLessonNames).toEqual(["A", "B", "C"])
})