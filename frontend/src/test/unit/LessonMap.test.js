// React
import React from 'react'
// Testing
import {shallow, mount} from 'enzyme'
// Main
import LessonMap from '../../main/LessonMap'
// Enzyme react-adapter configuration & others
import {configureAdapter, sleep} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = data => {
    return {
        fetchLessonNames: () => {
            return new Promise(resolve => resolve(data))
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

function lessonNames(topicLessonNames) {
    return {topicLessonNames: topicLessonNames}
}

async function shallowRenderLessonMap(course, server) {
    let lessonMap = shallow(<LessonMap courseName={course} server={server}/>)
    await sleep(mockServerLoadTimeMs)
    return lessonMap
}

async function fullRenderLessonMapWithAnalytics(course, server, analytics) {
    let lessonMap = mount(<LessonMap courseName={course} server={server} analytics={analytics}/>)
    await sleep(mockServerLoadTimeMs)
    lessonMap.update()
    return lessonMap
}

it('Shows the correct course name depending on the url', async () => {
    // Given: I am on the lesson map page for Thai
    let testLessonMap = await shallowRenderLessonMap("thai", mockServer(lessonNames([])))

    // When: I look around the page
    let content = testLessonMap.find('h1').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)

    // Then: I see that Thai is in the title
    expect(text).toBe("Choose a thai lesson")
})

it('Populates the lesson map with the lessons fetched from the server', async () => {
    // Given: There are two lessons available on the server
    let testServer = mockServer(lessonNames(["hello", "goodbye"]))

    // When: I am on the lesson map page
    let testLessonMap = await shallowRenderLessonMap("georgian", testServer)

    // Then: I see the two available lessons on the lesson list
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children()).toHaveLength(2)
})

it('Fills in the correct lesson data for the lessons of the lesson map', async () => {
    // Given: There are two lessons available on the server, named 'a' and 'b'
    let testServer = mockServer(lessonNames(["a", "b"]))

    // When: I am on the lesson map page
    let testLessonMap = await shallowRenderLessonMap("german", testServer)

    // Then: I see the names of the two lessons on the lesson list
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children().at(0).dive().childAt(0).text()).toEqual("a")
    expect(lessonsList.children().at(1).dive().childAt(0).text()).toEqual("b")
})

it('Shows correct link text for lesson names with spaces or punctuation', async () => {
    // Given: There is a lesson available on the server whose name ought not to be put in a url as-is.
    let testServer = mockServer(lessonNames(["A lesson that shouldn't be in a url"]))

    // When: I am on the lesson map page
    let testLessonMap = await shallowRenderLessonMap("edgecases", testServer)

    // Then: The text on the link button is still the same as the real lesson name
    let lessonsList = testLessonMap.find('.Lesson-list').first()
    let lessonButton = lessonsList.children().at(0).dive()

    expect(lessonButton.childAt(0).text()).toEqual("A lesson that shouldn't be in a url")
})

it('Shows the loading screen before the content is fetched', async () => {
    // Given: The server is slow
    let slowServer = mockSlowServer(lessonNames(["a", "b", "c"]))

    // When: I am on the lesson map page
    let testLessonMap = await shallowRenderLessonMap("thai", slowServer)

    // Then: The page indicates that it is loading
    let content = testLessonMap.find('h1').first()
    let lessonMapText = content.children()
    let text = lessonMapText.map(child => child.text()).reduce((acc, cur) => acc + cur)

    expect(text).toBe("Loading thai lessons")
})

it('Shows the lessons in order it recieves them from the server', async () => {
    let server = mockServer(lessonNames(["b", "c", "a"]))

    let testLessonMap = await shallowRenderLessonMap("course", server)

    let lessonsList = testLessonMap.find('.Lesson-list').first()
    expect(lessonsList.children().at(0).dive().childAt(0).text()).toEqual("b")
    expect(lessonsList.children().at(1).dive().childAt(0).text()).toEqual("c")
    expect(lessonsList.children().at(2).dive().childAt(0).text()).toEqual("a")
})

it("Sends analytics message when a lesson is clicked", async () => {
    let server = mockServer(lessonNames(["hello"]))
    let analytics = {recordEvent: jest.fn()}
    let testLessonMap = await fullRenderLessonMapWithAnalytics("georgian", server, analytics)

    testLessonMap.find("#lesson-button-hello").simulate("click")

    expect(analytics.recordEvent).toHaveBeenCalledWith("click@lesson-button-georgian-hello")
})

it("Sends analytics message for the specific lesson that is clicked on", async () => {
    let server = mockServer(lessonNames(["hello", "hi"]))
    let analytics = {recordEvent: jest.fn()}
    let testLessonMap = await fullRenderLessonMapWithAnalytics("georgian", server, analytics)

    testLessonMap.find("#lesson-button-hi").simulate("click")

    expect(analytics.recordEvent).toHaveBeenCalledWith("click@lesson-button-georgian-hi")
})