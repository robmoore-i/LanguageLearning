describe('Completing a TQ by pressing enter instead of clicking the button', function() {
    it('Completes the TQ by pressing enter', function() {
        cy.visit('http://localhost:3000/courses/French/Animals')
            .get('#answer-input-textbox').type('La Souris')
            .type("{enter}")
            .type("{enter}")
            .get('#lesson-accuracy-number').should('have.text', "100%")
    })
})
