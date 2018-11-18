describe('Courses Page', function() {
  it('Can see the Georgian, French and German courses!', function() {
    cy.visit('http://localhost:3000/courses')
    cy.get('#course-link-Georgian').should('exist')
    cy.get('#course-link-French').should('exist')
    cy.get('#course-link-German').should('exist')
  })
})
