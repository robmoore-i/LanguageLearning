import {Marker} from "../../main/Marker"
import Mark from "../../main/Mark"

it('Can have multiple correct answers', () => {
    let correctAnswers = ["car", "the car"] // Recall that marking is case insensitive, so need to be too exhaustive

    let q = {type: 0, given: "მანქანა", answers: correctAnswers}

    let marker = Marker()

    expect(marker.mark(q, "car")).toEqual(Mark.CORRECT)
    expect(marker.mark(q, "the car")).toEqual(Mark.CORRECT)
})
