/*
I want to my correct answers to be marked correctly
*/

describe('Completing some Georgian lessons as a new user', function() {
    it('Gets to the question and completes it with no mistakes.', function() {
        cy.visit('http://localhost:3000/courses/Georgian/Colours')
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
