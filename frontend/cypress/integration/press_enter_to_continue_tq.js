describe('Completing some Georgian lessons as a new user', function() {
    it('Gets to the question and completes it with no mistakes.', function() {
        cy.visit('http://localhost:3000/courses/French/Animals')
            .get('#answer-input-textbox').type('La Souris')
            .type("{enter}")
            .type("{enter}")
            .get('#lesson-accuracy-number').should('have.text', "100%")
    })
})
