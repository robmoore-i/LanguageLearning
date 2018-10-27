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
        fetchCourseNames: () => {
            return new Promise(resolve => resolve(courseNames))
        }
    }
}

async function fullRenderCourses(server) {
    let courses = mount(<Courses server={server} />)
    await sleep(mockServerLoadTimeMs)
    return courses
}

it('Directs the user to courses/georgian upon pressing the [georgian flag]', async () => {
    // Given: I am on the courses page
    let testServer = mockServer(["Georgian", "German"])
    let testCoursesPage = await fullRenderCourses(testServer)

    // When: I press the georgian course button
    let georgianCourseLink = testCoursesPage.find('#course-link-georgian').first()

    // Then: I am redirected to /courses/georgian
    expect(georgianCourseLink.is('[href="courses/georgian"]')).toBe(true)
})

it('Directs the user to courses/german upon pressing the [german flag]', async () => {
    // Given: I am on the courses page
    let testServer = mockServer(["Georgian", "German"])
    let testCoursesPage = await fullRenderCourses(testServer)

    // When: I press the german course button
    let germanCourseLink = testCoursesPage.find('#course-link-german').first()

    // Then: I am redirected to /courses/german
    expect(germanCourseLink.is('[href="courses/german"]')).toBe(true)
})

it('Requests the list of courses from the server', async () => {
    let testServer = mockServer(["Georgian", "German"])
    const spyFetch = jest.spyOn(testServer, "fetchCourseNames")

    let _testCoursesPage = await fullRenderCourses(testServer)

    expect(spyFetch).toHaveBeenCalled()
})