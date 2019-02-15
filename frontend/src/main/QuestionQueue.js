export function QuestionQueue(questionQueue, currentIndex) {
    let qq = questionQueue
    let curIndex = currentIndex
    return {
        repositionIncorrectlyAnsweredQuestion: (index) => {
            let incorrectQuestion = qq[index];
            let currentQuestionType = incorrectQuestion.type
            let i = index
            while (i < qq.length && qq[i].type === currentQuestionType) {
                i += 1
            }

            let head = qq.slice(0, i)
            let tail = qq.slice(i, qq.length)
            return head.concat([incorrectQuestion]).concat(tail)
        },

        count: () => qq.length,

        get: (i) => qq[i],

        toList: () => qq,

        completedAllQuestions: () => {
            return curIndex >= qq.length
        },

        currentQuestion: () => {
            return qq[curIndex]
        },

        currentIndex: () => {
            return curIndex
        },

        advance: () => {
            return QuestionQueue(qq, curIndex + 1)
        }
    }
}