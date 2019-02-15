export function QuestionQueue(questionQueue, currentIndex) {
    return {
        count: () => questionQueue.length,

        completedAllQuestions: () => {
            return currentIndex >= questionQueue.length
        },

        currentQuestion: () => {
            return questionQueue[currentIndex]
        },

        currentIndex: () => {
            return currentIndex
        },

        advance: () => {
            return QuestionQueue(questionQueue, currentIndex + 1)
        },

        reinsertIncorrectQuestion: () => {
            let incorrectQuestion = questionQueue[currentIndex]
            let currentQuestionType = incorrectQuestion.type
            let i = currentIndex
            while (i < questionQueue.length && questionQueue[i].type === currentQuestionType) {
                i += 1
            }

            let head = questionQueue.slice(0, i)
            let tail = questionQueue.slice(i, questionQueue.length)
            let newQuestionQueueList = head.concat([incorrectQuestion]).concat(tail)

            return QuestionQueue(newQuestionQueueList, currentIndex + 1)
        },

        toList: () => questionQueue
    }
}