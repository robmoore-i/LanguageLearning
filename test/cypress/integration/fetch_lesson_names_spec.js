it("/courses/georgian -- contains the available Georgian lessons", () => {
    cy.visit("http://localhost:3000/courses/georgian")

    let lessonButtons = cy.get(".Lesson-list").children()
    lessonButtons.should('have.length', 2)
})