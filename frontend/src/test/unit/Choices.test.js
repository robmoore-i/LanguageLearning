import {Choices} from '../../main/Choices'

it("Can get the choice keys for 3 choices", () => {
    let c = Choices(3)
    expect(c.isChoiceKey("4")).toBe(false)
})

it("'4' is a choice key when there's 4 choices", () => {
    let c = Choices(4)
    expect(c.isChoiceKey("4")).toBe(true)
})

it("Can create a bar separated string given a question object", () => {
    let c = Choices(4)
    let barSeparatedString = c.toBarSeparatedString({a: "a", b: "b", c: "c", d: "d"})
    expect(barSeparatedString).toEqual("|a|b|c|d|")
})

it("Can create a bar separated string given a question object of 3 questions", () => {
    let c = Choices(3)
    let barSeparatedString = c.toBarSeparatedString({a: "a", b: "b", c: "c"})
    expect(barSeparatedString).toEqual("|a|b|c|")
})