// React
import React from 'react'
// Testing
import {shallow} from 'enzyme'
// Main
import LessonMap from '../main/LessonMap'
// Enzyme react-adapter configuration & others
import {configureAdapter, sleep} from "./utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = lessonNames => {
    return {
        fetchLessonNames: () => {
            return new Promise(resolve => resolve(lessonNames))
        }
    }
}

let mockSlowServer = lessonNames => {
    return {
        fetchLessonNames: () => {
            return new Promise(async resolve => {
                await sleep(500)
                resolve(lessonNames)
            })
        }
    }
}

it('shows the correct course name depending on the url', async () => {
    // Given: I am on the lesson map page for Thai
    let dummyServer = mockServer([])
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/thai" server={dummyServer} />)
    await sleep(mockServerLoadTimeMs)

    // When: I look around the page
    let content = testLessonMap.find('h1').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)

    // Then: I see that Thai is in the title
    expect(text).toBe("Choose a thai lesson")
})

it('populates the lesson map with the lessons fetched from the server', async () => {
    // Given: There are two lessons available on the server
    let testServer = mockServer(["hello", "goodbye"])

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/georgian" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    // Then: I see the two available lessons on the lesson list
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children()).toHaveLength(2)
})

it('fills in the correct lesson data for the lessons of the lesson map', async () => {
    // Given: There are two lessons available on the server, named 'a' and 'b'
    let testServer = mockServer(["a", "b"])

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/german" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    // Then: I see the names of the two lessons on the lesson list
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children().at(0).dive().childAt(0).text()).toEqual("a")
    expect(lessonsList.children().at(1).dive().childAt(0).text()).toEqual("b")
})

it('creates links to lessons from the provided lesson data', async () => {
    // Given: There are two lessons available on the server, named 'doge' and 'pepe'
    let testServer = mockServer(["doge", "pepe"])

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/spanish" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    // Then: The links go to the appropriate lessons
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    let dogeLessonButton = lessonsList.children().at(0).dive()
    let pepeLessonButton = lessonsList.children().at(1).dive()

    expect(dogeLessonButton.is('[to="spanish/doge"]')).toBe(true)
    expect(pepeLessonButton.is('[to="spanish/pepe"]')).toBe(true)
})

it('homogenises lesson names which have spaces or punctuation', async () => {
    // Given: There is a lesson available on the server whose name ought not to be put in a url as-is.
    let testServer = mockServer(["A lesson that shouldn't be in a url"])

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/edgecases" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    // Then: The link is sensibly cleaned up
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    let lessonButton = lessonsList.children().at(0).dive()

    expect(lessonButton.is('[to="edgecases/A_lesson_that_shouldnt_be_in_a_url"]')).toBe(true)
})

it('shows correct link text for lesson names with spaces or punctuation', async () => {
    // Given: There is a lesson available on the server whose name ought not to be put in a url as-is.
    let testServer = mockServer(["A lesson that shouldn't be in a url"])

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/edgecases" server={testServer} />)
    await sleep(mockServerLoadTimeMs)

    // Then: The text on the link button is still the same as the real lesson name
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    let lessonButton = lessonsList.children().at(0).dive()

    expect(lessonButton.childAt(0).text()).toEqual("A lesson that shouldn't be in a url")
})

it('shows the loading screen before the content is fetched', () => {
    // Given: The server is slow
    let slowServer = mockSlowServer(["a", "b", "c"])

    // When: I am on the lesson map page
    let testLessonMap = shallow(<LessonMap location="http://localhost:3000/courses/thai" server={slowServer} />)

    // Then: The page indicates that it is loading
    let content = testLessonMap.find('h1').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)

    expect(text).toBe("Loading thai lessons")
})