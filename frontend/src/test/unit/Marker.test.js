import {Marker} from "../../main/Marker"
import Mark from "../../main/Mark"

it('Can have multiple correct answers', () => {
    let correctAnswers = ["car", "the car"] // Recall that marking is case insensitive, so need to be too exhaustive

    let q = {type: 0, given: "მანქანა", answers: correctAnswers}

    let marker = Marker()

    expect(marker.mark(q, "car")).toEqual(Mark.CORRECT)
    expect(marker.mark(q, "the car")).toEqual(Mark.CORRECT)
})

it('Can mark over multiple answers even if there is also a single answer', () => {
    let correctAnswers = ["She is a volunteer", "She's a volunteer", "He is a volunteer", "He's a volunteer"]

    let q = {type: 0, given: "ის მოხალისეა", answer: correctAnswers[0], answers: correctAnswers}

    let marker = Marker()

    expect(marker.mark(q, "She is a volunteer")).toEqual(Mark.CORRECT)
    expect(marker.mark(q, "She's a volunteer")).toEqual(Mark.CORRECT)
    expect(marker.mark(q, "He is a volunteer")).toEqual(Mark.CORRECT)
    expect(marker.mark(q, "He's a volunteer")).toEqual(Mark.CORRECT)
})