// React
import React from 'react'

// Testing
import { shallow, mount } from 'enzyme'

// Main
import Courses from '../../main/Courses'

// Enzyme react-adapter configuration
import {configureAdapter, sleep} from "../utils"

configureAdapter()

let mockServerLoadTimeMs = 1

let mockServer = courseNames => {
    return {
        fetchCourses: () => {
            return new Promise(resolve => resolve([{name:"Georgian", image: -1}, {name: "German", image: -2}]))
        }
    }
}

async function fullRenderCourses(server) {
    let courses = mount(<Courses server={server} />)
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

    let _testCoursesPage = await fullRenderCourses(testServer)

    expect(spyFetch).toHaveBeenCalled()
})
