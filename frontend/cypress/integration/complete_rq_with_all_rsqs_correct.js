describe('Completing an RQ with all subquestions correct.', function() {
    it('Completes the RQ with no mistakes.', function() {
        cy.visit('http://localhost:3000/courses/German/Colours')
            .get('#answer-input-textbox-0').type('blue')
            .get('#answer-input-textbox-1').type('red')
            .get('#answer-input-textbox-2').type('grass')
            .get('#submit-for-marking-button').click()
            .get('#question-result-correct-0').should('be.visible')
            .get('#question-result-correct-1').should('be.visible')
            .get('#question-result-correct-2').should('be.visible')
            .get('#continue-button').click()
    })
})
