import {QuestionQueue} from "../../main/QuestionQueue";

it("Pushes mcq only back up to the next rq", () => {
    let questionQueue = [{type: 2}, {type: 1, wrong: true}, {type: 1}, {type: 2}, {type: 0}]
    let qq = QuestionQueue(questionQueue, 1)

    let newQuestionQueue = qq.reinsertIncorrectQuestion()

    expect(newQuestionQueue.toList()).toEqual([{type: 2}, {type: 1, wrong: true}, {type: 1}, {type: 1, wrong: true}, {type: 2}, {type: 0}])
})

it("Pushes tq to the back even if it is the last question type", () => {
    let questionQueue = [{type: 2}, {type: 1}, {type: 1}, {type: 2}, {type: 0, wrong: true}, {type: 0}]
    let qq = QuestionQueue(questionQueue, 4)

    let newQuestionQueue = qq.reinsertIncorrectQuestion()

    expect(newQuestionQueue.toList()).toEqual([{type: 2}, {type: 1}, {type: 1}, {type: 2}, {type: 0, wrong: true}, {type: 0}, {type: 0, wrong: true}])
})