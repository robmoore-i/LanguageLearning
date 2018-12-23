describe('Can look at the available Georgian lessons', function() {
    it('Finds a few Georgian lessons', function() {
        cy.visit('http://localhost:3000')
            .get('#courses-link').click()
            .get('#course-link-French').should('be.visible')
            .get('#course-link-German').should('be.visible')
            .get('#course-link-Georgian').click()
            .get('.Lesson-list').children('a[href="Georgian/Colours"]').should('be.visible')
            .get('.Lesson-list').children('a[href="Georgian/What_are_you_called%3F"]').should('be.visible')
            .get('.Lesson-list').children('a[href="Georgian/Hello"]').should('be.visible')
    })
})
