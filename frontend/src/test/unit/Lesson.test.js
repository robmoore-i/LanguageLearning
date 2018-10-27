// React
import React from 'react'
// Testing
import {shallow, mount} from 'enzyme'
// Main
import Lesson from '../../main/Lesson'
// Enzyme react-adapter configuration & others
import {configureAdapter, sleep} from "../utils"
import {ObjectBuilder} from "../../main/ObjectBuilder";
import ProductionVariable from "../../main/ProductionVariable";
import {TranslationProduction} from "../../main/TranslationProduction";

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lesson => {
    return {
        fetchLesson: (lessonName, body) => {
            return new Promise(resolve => resolve(lesson))
        }
    }
}

async function shallowRenderLesson(course, lessonName, server) {
    let lesson = shallow(<Lesson courseName={course} encodedLessonName={encodeURIComponent(lessonName)} server={server} />)
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
            fetchLesson: (lessonName, body) => {
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

it('Adds questions which are answered incorrectly back into the questions list', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [tq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    let completionHandlers = testLesson.instance().questionCompletionHandlers()
    completionHandlers.onIncorrect()

    expect(testLesson.state("questions").length).toEqual(2)
})

it('Completes when the the incorrect then correct completion handlers are called', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [tq]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName="hello" server={testServer} />)
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

it('Shows the lesson stats page when all questions are complete', async () => {
    let dummyQuestion = {type: -1}
    let testServer = mockServer({name: "Hello!", questions: [dummyQuestion, dummyQuestion, dummyQuestion, dummyQuestion]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName="hello" server={testServer} />)
    testLesson.setState({currentQuestionIndex: 4}) // No more questions
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 100%")
})

it('Accurately shows a lesson accuracy of less than 100% when appropriate', async () => {
    let dummyQuestion = {type: -1}
    let testServer = mockServer({name: "Hello!", questions: [dummyQuestion, dummyQuestion, dummyQuestion, dummyQuestion]})
    let testLesson = mount(<Lesson courseName="georgian" encodedLessonName="hello" server={testServer} />)
    testLesson.setState({currentQuestionIndex: 10}) // Answered 10 times but only 4 questions were sent by the server.
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    expect(testLesson.find("#lesson-accuracy").text()).toEqual("Accuracy: 40%")
})

it('Shows the lesson time on the lesson stats page', async () => {
    let dummyQuestion = {type: -1}
    let testServer = mockServer({name: "Hello!", questions: [dummyQuestion, dummyQuestion, dummyQuestion, dummyQuestion]})
    let testLesson = shallow(<Lesson courseName="georgian" encodedLessonName="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    let lessonStats = testLesson.instance().renderLessonStats(85.3, 100.0)

    expect(lessonStats.props.children[1].props.children[1].props.children).toEqual("85.3%")
    expect(lessonStats.props.children[3].props.children[1].props.children).toEqual("100 seconds")
})

it('Truncates lesson accuracy to 1dp on the lesson stats page', async () => {
    let dummyQuestion = {type: -1}
    let testServer = mockServer({name: "Hello!", questions: [dummyQuestion, dummyQuestion, dummyQuestion, dummyQuestion]})
    let testLesson = shallow(<Lesson courseName="georgian" encodedLessonName="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    let lessonStats = testLesson.instance().renderLessonStats(67.6666666666666667, 55.3)

    expect(lessonStats.props.children[1].props.children[1].props.children).toEqual("67.7%")
    expect(lessonStats.props.children[3].props.children[1].props.children).toEqual("55.3 seconds")
})

it('Has a button to go back to the lesson map after completing a lesson', async () => {
    let dummyQuestion = {type: -1}
    let testServer = mockServer({name: "Hello!", questions: [dummyQuestion, dummyQuestion, dummyQuestion, dummyQuestion]})
    let testLesson = mount(<Lesson courseName="arabic" encodedLessonName="hello" server={testServer} />)
    testLesson.setState({currentQuestionIndex: 6})
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    expect(testLesson.find("#back-to-lessonmap-button").is('[href="/courses/arabic"]')).toBe(true)
})