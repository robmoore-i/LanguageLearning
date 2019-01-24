import {Choices} from '../../main/Choices'

it("Can get the choice keys for 3 choices", () => {
    let c = Choices(3)
    expect(c.isChoiceKey("4")).toBe(false)
})

it("'4' is a choice key when there's 4 choices", () => {
    let c = Choices(4)
    expect(c.isChoiceKey("4")).toBe(true)
})
