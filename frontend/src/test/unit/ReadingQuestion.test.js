// React
import React from 'react'
// Testing
import {mount, shallow} from 'enzyme'
// Main
import ReadingQuestion from '../../main/ReadingQuestion'
// Enzyme react-adapter configuration & others
import {configureAdapter, questionSubmitAndContinue, textBoxInputEvent} from "../utils"

configureAdapter()

it('Shows the source', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
            ]
    }
    let testRQ = shallow(<ReadingQuestion q={q} />)

    expect(testRQ.find("#question-extract").text()).toBe("Vlad went to the kitchen and got some cake")
})

it('Shows all the questions', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
        ]
    }
    let testRQ = shallow(<ReadingQuestion q={q} />)

    expect(testRQ.find("#sub-question-0").dive().find("#question-given-0").text()).toBe("Where did Vlad go?")
    expect(testRQ.find("#sub-question-1").dive().find("#question-given-1").text()).toBe("What did he get there?")
})

// Asserts that the (i)th sub question in the reading question(rq) is correct
let assertCorrect = (rq, i) => {
    expect(rq.find("#question-result-correct-" + i).exists()).toBe(true)
    expect(rq.find("#question-result-incorrect-" + i).exists()).toBe(false)
    expect(rq.find("#question-result-unmarked-" + i).exists()).toBe(false)
    expect(rq.find("#question-correction-" + i).exists()).toBe(false)
}

// Asserts that the (i)th sub question in the reading question(rq) is incorrect
let assertIncorrect = (rq, i) => {
    expect(rq.find("#question-result-correct-" + i).exists()).toBe(false)
    expect(rq.find("#question-result-incorrect-" + i).exists()).toBe(true)
    expect(rq.find("#question-result-unmarked-" + i).exists()).toBe(false)
    expect(rq.find("#question-correction-" + i).exists()).toBe(true)
}

it('Marks correct answers as correct', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Kitchen"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    assertCorrect(testRQ, 0)
    assertCorrect(testRQ, 1)
})

it('Marks incorrect answers as incorrect', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Ayy"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Lmao"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    assertIncorrect(testRQ, 0)
    assertIncorrect(testRQ, 1)
})

it('Marks questions separately', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"},
            {given: "What's this guy's name again?", answer: "Vlad"},
            {given: "What even is a kitchen?", answer: "A type of room"},
            {given: "And who are you?", answer: "A reading question, dummy"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
    testRQ.find("#answer-input-textbox-2").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#answer-input-textbox-3").simulate("change", textBoxInputEvent("A type of room"))
    testRQ.find("#answer-input-textbox-4").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    assertIncorrect(testRQ, 0)
    assertCorrect(testRQ, 1)
    assertIncorrect(testRQ, 2)
    assertCorrect(testRQ, 3)
    assertIncorrect(testRQ, 4)
})

it('Shows corrections for questions answered incorrectly', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answer: "Cake"},
            {given: "What's this guy's name again?", answer: "Vlad"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
    testRQ.find("#answer-input-textbox-2").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    expect(testRQ.find("#question-correction-0").text()).toEqual("Kitchen")
    expect(testRQ.find("#question-correction-1").exists()).toBe(false)
    expect(testRQ.find("#question-correction-2").text()).toEqual("Vlad")
})

it('The continue button appears after marking', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    expect(testRQ.find("#continue-button").exists()).toBe(true)
})

it('Calls the onCompletion prop when clicking continue', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"}
        ]
    }
    let spyOnCompletion = jest.fn()
    let testRQ = mount(<ReadingQuestion q={q} onCompletion={spyOnCompletion} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Kitchen"))
    questionSubmitAndContinue(testRQ)

    expect(spyOnCompletion).toHaveBeenCalled()
})

it('Ignores whitespace, case, commas, fullstops, exclamation marks and question mark when marking', () => {
    let correctAnswer = "He went to the kitchen! Would you BELIEVE IT?!!"
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: correctAnswer}
        ]
    }
    let spyOnCompletion = jest.fn()
    let testRQ = mount(<ReadingQuestion q={q} onCompletion={spyOnCompletion} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("  He  went   to    THE  KITCHEN!?  would. yOU. beliEVE it."))
    questionSubmitAndContinue(testRQ)

    let expectedCorrect = 1
    let expectedIncorrect = 0
    expect(spyOnCompletion).toHaveBeenCalledWith(expectedCorrect, expectedIncorrect)
})

it('Warns user before marking if an answer box is empty', () => {
  let q = {
      type: 2,
      extract: "Vlad went to the kitchen and got some cake",
      questions: [
          {given: "Where did Vlad go?", answer: "Kitchen"}
      ]
  }

  let testRQ = mount(<ReadingQuestion q={q} />)

  testRQ.find("#submit-for-marking-button").simulate("click")

  expect(testRQ.find("#unanswered-questions-warning").exists()).toBe(true)
  expect(testRQ.find("#submit-for-marking-button").exists()).toBe(true)
  expect(testRQ.find("#continue-button").exists()).toBe(false)
})

it('Warns user before marking if any answer box is empty', () => {
  let q = {
      type: 2,
      extract: "Vlad went to the kitchen and got some cake",
      questions: [
          {given: "Where did Vlad go?", answer: "Kitchen"},
          {given: "What did he get there?", answer: "Cake"},
          {given: "What's this guy's name again?", answer: "Vlad"}
      ]
  }

  let testRQ = mount(<ReadingQuestion q={q} />)

  testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Kitchen"))
  testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
  testRQ.find("#submit-for-marking-button").simulate("click")

  expect(testRQ.find("#unanswered-questions-warning").exists()).toBe(true)
})

it('Can have subquestions with multiple potential correct answers', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answers: ["The kitchen", "Kitchen"]},
            {given: "What did he get there?", answers: ["The cake", "Cake"]},
            {given: "Who is this guy again?", answer: "Vlad"}
        ]
    }

    let spyOnCompletion = jest.fn()
    let testRQ = mount(<ReadingQuestion q={q} onCompletion={spyOnCompletion} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("The kitchen"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Cake"))
    testRQ.find("#answer-input-textbox-2").simulate("change", textBoxInputEvent("Vlad"))
    questionSubmitAndContinue(testRQ)

    let expectedCorrect = 3
    let expectedIncorrect = 0
    expect(spyOnCompletion).toHaveBeenCalledWith(expectedCorrect, expectedIncorrect)
})

it('Shows corrections for subquestions with multiple potential correct answers', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {given: "Where did Vlad go?", answer: "Kitchen"},
            {given: "What did he get there?", answers: ["Cake", "Some cake"]},
            {given: "What's this guy's name again?", answer: "Vlad"}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("Kitchen"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#answer-input-textbox-2").simulate("change", textBoxInputEvent("Wrong"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    expect(testRQ.find("#question-correction-0").exists()).toBe(false)
    expect(testRQ.find("#question-correction-1").text()).toBe("Cake")
    expect(testRQ.find("#question-correction-2").text()).toEqual("Vlad")
})

it('Indexes subquestions in the correct order if order is given', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {index: 2, given: "What's this guy's name again?", answer: "Vlad"},
            {index: 0, given: "Where did Vlad go?", answer: "Kitchen"},
            {index: 1, given: "What did he get there?", answers: ["Cake", "Some cake"]}
        ]
    }
    let testRQ = shallow(<ReadingQuestion q={q} />)

    expect(testRQ.find("#sub-question-0").dive().find("#question-given-0").text()).toBe("Where did Vlad go?")
    expect(testRQ.find("#sub-question-1").dive().find("#question-given-1").text()).toBe("What did he get there?")
    expect(testRQ.find("#sub-question-2").dive().find("#question-given-2").text()).toBe("What's this guy's name again?")
})

it('Renders subquestions in index order', () => {
    let q = {
        type: 2,
        extract: "Vlad went to the kitchen and got some cake",
        questions: [
            {index: 2, given: "What's this guy's name again?", answer: "Vlad"},
            {index: 0, given: "Where did Vlad go?", answer: "Kitchen"},
            {index: 1, given: "What did he get there?", answers: ["Cake", "Some cake"]}
        ]
    }
    let testRQ = mount(<ReadingQuestion q={q} />)

    let questionsDiv = testRQ.find("#questions")
    expect(questionsDiv.childAt(0).prop("id")).toEqual("sub-question-0")
    expect(questionsDiv.childAt(1).prop("id")).toEqual("sub-question-1")
    expect(questionsDiv.childAt(2).prop("id")).toEqual("sub-question-2")
})

it('Marks all answers as correct when all answers are correct', () => {
    let q = {
        type: 2,
        extract: "მატარებელი ლურჯია და მანქანა წითელი არის. ბალახი მწვანეა.",
        questions: [
            {index: 2, given: "What is said to be green?", answers: ["Grass", "The grass"]},
            {index: 0, given: "What colour is the train?", answer: "blue"},
            {index: 1, given: "What colour is the car?", answer: "red"}
        ]
    }

    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("blue"))
    testRQ.find("#answer-input-textbox-1").simulate("change", textBoxInputEvent("red"))
    testRQ.find("#answer-input-textbox-2").simulate("change", textBoxInputEvent("grass"))

    testRQ.find("#submit-for-marking-button").simulate("click")

    assertCorrect(testRQ, 0)
    assertCorrect(testRQ, 1)
    assertCorrect(testRQ, 2)
})

it('Text area becomes read-only if a correct answer is marked', () => {
    let q = {
        type: 2,
        extract: "მატარებელი ლურჯია და მანქანა წითელი არის. ბალახი მწვანეა.",
        questions: [
            {index: 0, given: "What is said to be green?", answers: ["Grass", "The grass"]}
        ]
    }

    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("grass"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    expect(testRQ.find("#answer-input-textbox-0").prop("readOnly")).toBe(true)
    expect(testRQ.find("#answer-input-textbox-0").hasClass("colourclass-question-result-correct")).toBe(true)
})

it('Text area becomes read-only if an incorrect answer is marked', () => {
    let q = {
        type: 2,
        extract: "მატარებელი ლურჯია და მანქანა წითელი არის. ბალახი მწვანეა.",
        questions: [
            {index: 0, given: "What is said to be green?", answers: ["Grass", "The grass"]}
        ]
    }

    let testRQ = mount(<ReadingQuestion q={q} />)

    testRQ.find("#answer-input-textbox-0").simulate("change", textBoxInputEvent("wrong"))
    testRQ.find("#submit-for-marking-button").simulate("click")

    expect(testRQ.find("#answer-input-textbox-0").prop("readOnly")).toBe(true)
    expect(testRQ.find("#answer-input-textbox-0").hasClass("colourclass-question-result-incorrect")).toBe(true)
})

it('Shows only the continue button if questions is a empty list', () => {
    let q = {
        type: 2,
        extract: "A question-less extract",
        questions: []
    }
    let testRQ = shallow(<ReadingQuestion q={q} />)

    expect(testRQ.find("#read-the-extract-prompt").text()).toBe("")
    expect(testRQ.find("#read-the-extract-prompt").exists()).toBe(true)
})

it('Shows only the continue button if there isnt a questions property', () => {
    let q = {
        type: 2,
        extract: "A question-less extract"
    }
    let testRQ = shallow(<ReadingQuestion q={q} />)

    expect(testRQ.find("#read-the-extract-prompt").text()).toBe("")
    expect(testRQ.find("#read-the-extract-prompt").exists()).toBe(true)
})
