describe('Can look at available lessons for a course', function() {
    it("Finds the 'Clothes' and 'Colours' lessons", function() {
        cy.visit('http://localhost:3000')
            .get('#courses-link').click()
            .get('#course-link-German').click()
            .get('.Lesson-list').children('a[href="German/Clothes"]').should('be.visible')
            .get('.Lesson-list').children('a[href="German/Colours"]').should('be.visible')
    })
})
