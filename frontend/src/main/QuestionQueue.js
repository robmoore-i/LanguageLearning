export function QuestionQueue(questionQueue) {
    let qq = questionQueue
    return {
        repositionIncorrectlyAnsweredQuestion: (index) => {
            // qq[index] is wrong
            // find index of next element not of type qq[index].type
            let incorrectQuestion = qq[index];
            let currentQuestionType = incorrectQuestion.type
            let i = index
            while (qq[i].type === currentQuestionType) {
                i += 1
            }

            let head = qq.slice(0, i)
            let tail = qq.slice(i, qq.length)
            return head.concat([incorrectQuestion]).concat(tail)
        }
    }
}