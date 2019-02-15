export function QuestionQueue(questionQueue) {
    let qq = questionQueue
    return {
        repositionIncorrectlyAnsweredQuestion: (index) => {
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