describe('Completing a translation question by pressing enter', function() {
    it('Gets to the question and completes it without making a mistake and pressing enter to submit rather than clicking the button', function() {
        cy.visit('http://localhost:3000/courses/French/Animals')
            .get('#answer-input-textbox').type('La Souris')
            .type("{enter}")
            .type("{enter}")
            .get('#lesson-accuracy-number').should('have.text', "100%")
    })
})
