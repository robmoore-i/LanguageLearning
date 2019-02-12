// React
import React from 'react'
// Testing
import {mount} from 'enzyme'
// Main
import Courses from '../../main/Courses'
// Enzyme react-adapter configuration
import {configureAdapter, sleep} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = courseNames => {
    let courses = courseNames.map(courseName => {
        return {name: courseName, image: -1}
    })

    return {
        fetchCourses: () => {
            return new Promise(resolve => resolve(courses))
        }
    }
}

async function fullRenderCourses(server) {
    let courses = mount(<Courses server={server} analytics={{recordEvent: jest.fn()}}/>)
    await sleep(mockServerLoadTimeMs)
    return courses
}

async function fullRenderCoursesWithAnalytics(server, analytics) {
    let courses = mount(<Courses server={server} analytics={analytics}/>)
    await sleep(mockServerLoadTimeMs)
    return courses
}

it('Directs the user to courses/georgian upon pressing the [georgian flag]', async () => {
    let testServer = mockServer(["Georgian", "German"])
    let testCoursesPage = await fullRenderCourses(testServer)
    testCoursesPage.update()

    let georgianCourseLink = testCoursesPage.find('#course-link-Georgian')

    expect(georgianCourseLink.is('[href="Georgian"]')).toBe(true)
})

it('Directs the user to courses/german upon pressing the [german flag]', async () => {
    let testServer = mockServer(["Georgian", "German"])
    let testCoursesPage = await fullRenderCourses(testServer)
    testCoursesPage.update()

    let germanCourseLink = testCoursesPage.find('#course-link-German')

    expect(germanCourseLink.is('[href="German"]')).toBe(true)
})

it('Requests the list of course names from the server', async () => {
    let testServer = mockServer(["Georgian", "German"])
    const spyFetch = jest.spyOn(testServer, "fetchCourses")

    await fullRenderCourses(testServer)

    expect(spyFetch).toHaveBeenCalled()
})

it("Sets courses to empty list if server fetches null", async () => {
    let testServer = {
        fetchCourses: () => {
            return new Promise(resolve => resolve(null))
        }
    }
    let testCoursesPage = await fullRenderCourses(testServer)

    expect(testCoursesPage.state().courses).toEqual([])
})

it("Courses list is empty if server fetches no courses", async () => {
    let testServer = mockServer([])
    let testCoursesPage = await fullRenderCourses(testServer)

    expect(testCoursesPage.state().courses).toEqual([])
})

it("Sends analytics message when a course button is clicked", async () => {
    let testAnalytics = {recordEvent: jest.fn()}
    let testServer = mockServer(["Georgian", "German"])
    let testCoursesPage = await fullRenderCoursesWithAnalytics(testServer, testAnalytics)
    testCoursesPage.update()

    testCoursesPage.find('#course-link-German').simulate("click")

    expect(testAnalytics.recordEvent).toHaveBeenCalledWith("click@course-button-german")
})

it("Sends analytics message with the course's name when the course button is clicked", async () => {
    let testAnalytics = {recordEvent: jest.fn()}
    let testServer = mockServer(["Georgian", "German"])
    let testCoursesPage = await fullRenderCoursesWithAnalytics(testServer, testAnalytics)
    testCoursesPage.update()

    testCoursesPage.find('#course-link-Georgian').simulate("click")

    expect(testAnalytics.recordEvent).toHaveBeenCalledWith("click@course-button-georgian")
})

it("Doesn't send analytics message if a button isn't clicked", async () => {
    let testAnalytics = {recordEvent: jest.fn()}
    let testServer = mockServer(["Georgian", "German"])
    let testCoursesPage = await fullRenderCoursesWithAnalytics(testServer, testAnalytics)
    testCoursesPage.update()

    expect(testAnalytics.recordEvent).not.toHaveBeenCalled()
})