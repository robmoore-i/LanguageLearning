import {TranslationProduction} from "../../main/TranslationProduction";
import {ObjectBuilder} from "../../main/ObjectBuilder";
import ProductionVariable from "../../main/ProductionVariable";
import {LocalServer} from "../../main/Server";

it('Creates questions itself when sent productions from the server', () => {
    let jsonTP = {
        given: "(name) => \"Hello \" + name",
        answer: "(name) => \"გამარჯობა \" + name",
        variables: [ProductionVariable.NAME]
    }

    let input1 = ObjectBuilder().put(ProductionVariable.NAME, "Imogen").build() // {name: Imogen}
    let input2 = ObjectBuilder().put(ProductionVariable.NAME, "Simon").build()  // (name: Simon}

    let mockFetcher = {
        postJSON: (url, body) => {
            return new Promise(resolve => resolve(
                {
                    name: "Hello!",
                    productions: [
                        {
                            production: jsonTP,
                            inputs: [input1, input2]
                        }
                    ]
                }
            ))
        }
    }
    let testServer = LocalServer(mockFetcher)

    let expectedProduction = TranslationProduction((name) => "Hello " + name, (name) => "გამარჯობა " + name, [ProductionVariable.NAME])
    testServer.fetchLesson("some lesson").then(lesson => {
        expect(lesson.name).toEqual("Hello!")
        expect(lesson.questions).toEqual([expectedProduction.using(input1), expectedProduction.using(input2)])
    })
})

it('Returns the sent questions when sent questions explicitly', () => {
    let mcq = {type: 1, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let mockFetcher = {
        postJSON: (url, body) => {
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
        getJSON: (url) => {
            return new Promise(resolve => resolve(["A", "B", "C"]))
        }
    }
    let testServer = LocalServer(mockFetcher)

    testServer.fetchLessonNames().then(lessonNames => {
        expect(lessonNames).toEqual(["A", "B", "C"])
    })
})