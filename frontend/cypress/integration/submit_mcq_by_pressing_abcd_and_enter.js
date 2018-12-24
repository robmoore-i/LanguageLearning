describe('Completing an MCQ by using ABCD and enter instead of clicking buttons', function() {
    it('Completes the MCQ by using ABCD and enter', function() {
        cy.visit('http://localhost:3000/courses/French/Food')
            .type("c")
            .type("{enter}")
            .get('#lesson-accuracy-number').should('have.text', "100%")
    })
})
