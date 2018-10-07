// React
import React from 'react'
// Testing
import {shallow} from 'enzyme'
// Main
import Lesson from '../main/Lesson'
// Enzyme react-adapter configuration & others
import {configureAdapter, sleep} from "./utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lesson => {
    return {
        fetchLesson: () => {
            return new Promise(resolve => resolve(lesson))
        }
    }
}

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

async function shallowRenderLesson(course, lessonName, server) {
    let lesson = shallow(<Lesson location={"http://localhost:3000/courses/" + course + "/" + lessonName} server={server} />)
    await sleep(mockServerLoadTimeMs)
    return lesson
}

it('shows the lesson name from the lesson data', async () => {
    // Given: I am on the lesson map page for the Japanese lesson called hello
    let testServer = mockServer({name: "Hello!"})
    let testLesson = await shallowRenderLesson("japanese", "hello", testServer)

    // When: I look at the title
    let title = testLesson.find('h1').first()
    let text = title.children().map(child => child.text()).reduce((acc, cur) => acc + cur)

    // Then: I see that the lesson name is displayed with the course name
    expect(text).toBe("Japanese: Hello!")
})

it('shows the loading screen while loading', async () => {
    // Given: The server is slow
    let slowServer = mockSlowServer({name: "boxing"})

    // When: I am on the lesson map page
    let testLesson = await shallowRenderLesson("thai", "boxing", slowServer)

    // Then: The page indicates that it is loading
    let title = testLesson.find('h1').first()
    let text = title.children().map(child => child.text()).reduce((acc, cur) => acc + cur)

    expect(text).toBe("Loading thai: boxing")
})