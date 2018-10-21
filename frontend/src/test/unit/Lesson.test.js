// React
import React from 'react'
// Testing
import {shallow, mount} from 'enzyme'
// Main
import Lesson from '../../main/Lesson'
// Enzyme react-adapter configuration & others
import {configureAdapter, sleep} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lesson => {
    return {
        fetchLesson: (lessonNameInUrl) => {
            return new Promise(resolve => resolve(lesson))
        }
    }
}

let mockSlowServer = lesson => {
    return {
        fetchLesson: (lessonNameInUrl) => {
            return new Promise(async resolve => {
                await sleep(500)
                resolve(lesson)
            })
        }
    }
}

async function shallowRenderLesson(course, lessonNameInUrl, server) {
    let lesson = shallow(<Lesson courseName={course} lessonNameInUrl={lessonNameInUrl} server={server} />)
    await sleep(mockServerLoadTimeMs)
    return lesson
}

it('Shows the lesson name from the lesson data', async () => {
    // Given: I am in a Japanese lesson called hello
    let testServer = mockServer({name: "Hello!", questions: [{type: -1}]})
    let testLesson = await shallowRenderLesson("japanese", "hello", testServer)

    // When: I look at the title
    let title = testLesson.find('h1').first()
    let text = title.children().map(child => child.text()).reduce((acc, cur) => acc + cur)

    // Then: I see that the lesson name is displayed with the course name
    expect(text).toBe("Japanese: Hello!")
})

it('Shows the loading screen while loading', async () => {
    // Given: The server is slow
    let slowServer = mockSlowServer({name: "boxing"})

    // When: I am in a lesson
    let testLesson = await shallowRenderLesson("thai", "boxing", slowServer)

    // Then: The page indicates that it is loading
    let title = testLesson.find('h1').first()
    let text = title.children().map(child => child.text()).reduce((acc, cur) => acc + cur)

    expect(text).toBe("Loading thai: boxing")
})

it('Adds questions which are answered incorrectly back into the questions list', async () => {
    let tq = {type: 0, given: "hello", answer: "გამარჯობა"}
    let testServer = mockServer({name: "Hello!", questions: [tq]})
    let testLesson = mount(<Lesson courseName="georgian" lessonNameInUrl="hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)
    testLesson.update()

    let completionHandlers = testLesson.instance().questionCompletionHandlers()
    completionHandlers.onIncorrect()

    expect(testLesson.state("questions").length).toEqual(2)
})