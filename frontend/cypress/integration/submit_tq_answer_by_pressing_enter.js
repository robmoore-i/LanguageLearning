describe('Completing a TQ by pressing enter instead of clicking the button', function() {
    it('Completes the TQ by pressing enter', function() {
        cy.visit('http://localhost:3000/courses/French/Animals')
            .get('#question-given').then((elem) => {
                let text = elem.text().trim()
                if (text === "La Souris") {
                    return cy.get('#answer-input-textbox').type('Mouse')
                } else if (text === "Mouse") {
                    return cy.get('#answer-input-textbox').type('La Souris')
                } else {
                    console.log("Expected #question-given text, \"" + text + "\", to equal either \"La Souris\" or \"Mouse\"")
                    assert.isTrue(false)
                }
            })
            .type("{enter}")
            .type("{enter}")
            .get('#lesson-accuracy-number').should('have.text', "100%")
    })
})
