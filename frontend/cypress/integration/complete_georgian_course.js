/*
I want to learn Georgian
I go to melange's homepage
I click 'Get Started'
I click the Georgian course button
I click the Hello lesson
I complete the lesson, getting the first question incorrect
I want to be returned to the Georgian course page
*/

describe('Completing some Georgian lessons as a new user', function() {
    it('Gets to the lesson and completes it with one mistake.', function() {
        cy.visit('http://localhost:3000')
            .get('#courses-link').click()
            // Assert that the French and German courses are both there
            .get('#course-link-French').should('be.visible')
            .get('#course-link-German').should('be.visible')

            .get('#course-link-Georgian').click()
            // Assert that the Colours and What are you called? lessons are both there
            .get('.Lesson-list').children('a[href="/courses/Georgian/Colours"]').should('be.visible')
            .get('.Lesson-list').children('a[href="/courses/Georgian/What_are_you_called%3F"]').should('be.visible')

            .get('.Lesson-list').children('a[href="/courses/Georgian/Hello"]').click()
            .get('#choice-c').click()
            // Assert that choice c is selected
            .get('#choice-c').should('have.class', 'choice-checked')

            .get('#submit-for-marking-button').click()
            // Assert that it was marked incorrect
            // Assert that incorrect answer is highlighted red
            // Assert that the correction is highlighted blue
            .get('#question-result-incorrect').should('be.visible')
            .get('#choice-c').should('have.class', 'choice-marked-incorrect')
            .get('#choice-d').should('have.class', 'choice-correction')

            .get('#continue-button').click()
            .get('#answer-input-textbox').type("გამარჯობა")
            .get('#submit-for-marking-button').click()
            // Assert that it was marked correct
            // Assert that the textarea is readonly
            .get('#question-result-correct').should('be.visible')
            .get('#answer-input-textbox').should('have.prop', 'readonly')

            .get('#continue-button').click()
            .get('#choice-d').click()
            .get('#submit-for-marking-button').click()
            // Assert that it was marked correct
            .get('#question-result-correct').should('be.visible')

            .get('#continue-button').click()
            // Assert that the accuracy is 66.7%
            // Assert that the time taken to complete the lesson is less than 5 seconds
            .get('#lesson-accuracy-number').should('have.text', '66.7%')
            .get('#lesson-time-number').invoke('text').then(text => {
                let lessonTimeSeconds = parseFloat(text.split(' ')[0])
                assert.isAtMost(lessonTimeSeconds, 5)
            })

            .get('#back-to-lessonmap-button').click()
            .get('.Lesson-list').children('a[href="/courses/Georgian/Colours"]').click()
            .get('#answer-input-textbox-0').type('wrong')
            .get('#answer-input-textbox-1').type('wrong')
            .get('#answer-input-textbox-2').type('grass')
            .get('#submit-for-marking-button').click()
            // Assert that questions 0 and 1 were marked incorrect
            // Assert that question 2 was marked correct
            // Assert that there are corrections shown for questions 0 and 1
            .get('#question-result-incorrect-0').should('be.visible')
            .get('#question-result-incorrect-1').should('be.visible')
            .get('#question-result-correct-2').should('be.visible')
            .get('#question-correction-0').should('have.text', 'blue')
            .get('#question-correction-1').should('have.text', 'red')

            .get('#continue-button').click()
            // Assert that the accuracy is 33.3%
            // Assert that the time taken to complete the lesson is less than 5 seconds
            .get('#lesson-accuracy-number').should('have.text', '33.3%')
            .get('#lesson-time-number').invoke('text').then(text => {
                let lessonTimeSeconds = parseFloat(text.split(' ')[0])
                assert.isAtMost(lessonTimeSeconds, 5)
            })

            .get('#back-to-lessonmap-button').click()
            // Assert that we're back on the lesson map page.
            .get('.Lesson-map-title').should("contain", "Choose a Georgian lesson")
    })
})
