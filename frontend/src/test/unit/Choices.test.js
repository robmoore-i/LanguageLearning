import {Choices} from '../../main/Choices'

it("Can get the choice keys for 3 choices", () => {
    let c = Choices(3)
    expect(c.isChoiceKey("4")).toBe(false)
})
