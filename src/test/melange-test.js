function followLink(link) {
    link.simulate('click', { button: 0 })
}

function assertHasChild(component, selector) {
    expect(component.find(selector)).toHaveLength(1)
}

module.exports = { followLink, assertHasChild }