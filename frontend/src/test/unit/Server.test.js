import {TranslationProduction} from "../../main/TranslationProduction";
import {ObjectBuilder} from "../../main/ObjectBuilder";
import ProductionVariable from "../../main/ProductionVariable";
import {LocalServer} from "../../main/Server";

it('Creates questions itself when sent productions from the server', () => {
    let tp = TranslationProduction((name) => "Hello " + name, (name) => "გამარჯობა " + name, [ProductionVariable.NAME])
    let input = ObjectBuilder().put(ProductionVariable.NAME, "Rob").build()
    let mockFetcher = {
        fetchJSON: (url) => {
            return new Promise(resolve => resolve(
                {
                    name: "Hello!",
                    productionInputsPairs: {
                        productions: [tp],
                        inputs: [[input]]
                    }
                }
            ))
        }
    }
    let testServer = LocalServer(mockFetcher)

    testServer.fetchLesson("some_lesson").then(lesson => {
        expect(lesson.name).toEqual("Hello!")
        expect(lesson.questions).toEqual([tp.using(input)])
    })
})

it('Returns the sent questions when sent questions explicitly', () => {
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let mockFetcher = {
        fetchJSON: (url) => {
            return new Promise(resolve => resolve(
                {
                    name: "Server Stuff",
                    questions: [mcq, tq]
                }
            ))
        }
    }
    let testServer = LocalServer(mockFetcher)

    testServer.fetchLesson("ayylmao").then(lesson => {
        expect(lesson.name).toEqual("Server Stuff")
        expect(lesson.questions).toEqual([mcq, tq])
    })
})

it('Returns lesson names as given by server', () => {
    let mockFetcher = {
        fetchJSON: (url) => {
            return new Promise(resolve => resolve(["A", "B", "C"]))
        }
    }
    let testServer = LocalServer(mockFetcher)

    testServer.fetchLessonNames().then(lessonNames => {
        expect(lessonNames).toEqual(["A", "B", "C"])
    })
})