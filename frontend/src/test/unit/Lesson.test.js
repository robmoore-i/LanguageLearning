// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import Lesson from '../../main/Lesson'
import {nonShuffler} from "../../main/Shuffler"
// Enzyme react-adapter configuration & others
import {configureAdapter, sleep} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lesson => {
    return {
        fetchLesson: () => {
            return new Promise(resolve => resolve(lesson))
        }
    }
}

async function shallowRenderLesson(course, lessonName, server) {
    let lesson = shallow(<Lesson courseName={course} encodedLessonName={encodeURIComponent(lessonName)} server={server} shuffler={nonShuffler} />)
    await sleep(mockServerLoadTimeMs)
    return lesson
}

it('Shows the lesson name from the lesson data', async () => {
    // Given: I am in a Japanese lesson called hello
    let testServer = mockServer({name: "Hello!", questions: [{type: -1}]})
    let testLesson = await shallowRenderLesson("japanese", "Hello!", testServer)

    // When: I look at the title
    let title = testLesson.find('h1').first()
    let text = title.children().map(child => child.text()).reduce((acc, cur) => acc + cur)

    // Then: I see that the lesson name is displayed with the course name
    expect(text).toBe("Japanese: Hello!")
})

it('Shows the loading screen while loading', async () => {
    let mockSlowServer = lesson => {
        return {
            fetchLesson: () => {
                return new Promise(async resolve => {
                    await sleep(500)
                    resolve(lesson)
                })
            }
        }
    }

    // Given: The server is slow
    let slowServer = mockSlowServer({name: "Boxing"})

    // When: I am in a lesson
    let testLesson = await shallowRenderLesson("Thai", "Boxing", slowServer)

    // Then: The page indicates that it is loading
    let title = testLesson.find('h1').first()
    let text = title.children().map(child => child.text()).reduce((acc, cur) => acc + cur)

    expect(text).toBe("Loading Thai: Boxing")
})

async function mountRenderLesson(course, lessonName, server) {
    let lesson = mount(<Lesson courseName={course} encodedLessonName={encodeURIComponent(lessonName)} server={server} shuffler={nonShuffler} />)
    await sleep(mockServerLoadTimeMs)
    lesson.update()
    return lesson
}

it('Adds incorrectly answered translation question back into the questions list', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [tq]})
    let testLesson = await mountRenderLesson("georgian", "hello", testServer)

    let completionHandlers = testLesson.instance().questionCompletionHandlers()
    completionHandlers.onIncorrect()

    expect(testLesson.state("questions").length).toEqual(2)
})

it('Completes when the the incorrect then correct completion handlers are called', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [tq]})
    let testLesson = await mountRenderLesson("georgian", "hello", testServer)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    let completionHandlers = testLesson.instance().questionCompletionHandlers()
    completionHandlers.onIncorrect()
    testLesson.update()
    let completionHandlers2 = testLesson.instance().questionCompletionHandlers()
    completionHandlers2.onCorrect()

    expect(testLesson.state("questions").length).toEqual(2)
    expect(testLesson.state("currentQuestionIndex")).toEqual(2)
})

it('Fetches the lesson from the server based on the course name and lesson name', async () => {
    let testServer = {
        fetchLessonCalledWithCourseName: null,
        fetchLessonCalledWithLessonName: null,
        fetchLesson: (courseName, lessonName) => {
            testServer.fetchLessonCalledWithCourseName = courseName
            testServer.fetchLessonCalledWithLessonName = lessonName
            return new Promise(resolve => resolve({questions: []}))
        }
    }

    await mountRenderLesson("Georgian", "Hello", testServer)

    expect(testServer.fetchLessonCalledWithCourseName).toEqual("Georgian")
    expect(testServer.fetchLessonCalledWithLessonName).toEqual("Hello")
})

it('Pushes incorrectly answered MCQ only back up to the next RQ', async () => {
    let rq1 = {
        type: 2,
        extract: "First you'll learn about the alphabet!",
        questions: [],
        index: 0
    }
    let mcq1 = {type: 1, index: 1, question: "sounds like \"a\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "a"}
    let mcq2 = {type: 1, index: 2, question: "sounds like \"i\" in English", a: "ა", b: "ო", c: "უ", d: "ი", answer: "d"}
    let rq2 = {
        type: 2,
        extract: "Next you'll learn a word.",
        questions: [],
        index: 3
    }
    let tq = {type: 0, index: 4, given: "hello", answer: "გამარჯობა"}

    let testServer = mockServer({name: "Hello!", questions: [rq1, mcq1, mcq2, rq2, tq]})
    let testLesson = await mountRenderLesson("georgian", "hello", testServer)

    let completionHandlers = testLesson.instance().questionCompletionHandlers()

    completionHandlers.onCompletion(0, 0) // Complete RQ
    completionHandlers.onCorrect() // Complete MCQ1 incorrectly
    completionHandlers.onIncorrect() // Complete MCQ1 correctly

    expect(testLesson.state("questions")[testLesson.state("currentQuestionIndex")]).toEqual(mcq1)
})