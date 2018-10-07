// React
import React from 'react'
// Testing
import {shallow} from 'enzyme'
// Main
import Lesson from '../main/Lesson'
// Enzyme react-adapter configuration
import {configureAdapter} from "./setup"

configureAdapter()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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

it('shows the lesson name from the lesson data', async () => {
    // Given: I am on the lesson map page for the Japanese lesson called hello
    let testServer = mockServer({name: "Hello!"})
    let testLesson = shallow(<Lesson location="http://localhost:3000/courses/japanese/hello" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    // When: I look at the title
    let title = testLesson.find('h1').first()
    let text = title.children().map(child => child.text()).reduce((acc, cur) => acc + cur)

    // Then: I see that the lesson name is displayed with the course name
    expect(text).toBe("Japanese: Hello!")
})

it('shows the loading screen while loading', () => {
    // Given: The server is slow
    let slowServer = mockSlowServer({name: "boxing"})

    // When: I am on the lesson map page
    let testLessonMap = shallow(<Lesson location="http://localhost:3000/courses/thai/boxing" server={slowServer} />)

    // Then: The page indicates that it is loading
    let content = testLessonMap.find('h1').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)

    expect(text).toBe("Loading thai: boxing")
})