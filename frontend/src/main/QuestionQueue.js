export function QuestionQueue(questionQueue, currentIndex) {
    return {
        repositionIncorrectlyAnsweredQuestion: (index) => {
            let incorrectQuestion = questionQueue[index];
            let currentQuestionType = incorrectQuestion.type
            let i = index
            while (i < questionQueue.length && questionQueue[i].type === currentQuestionType) {
                i += 1
            }

            let head = questionQueue.slice(0, i)
            let tail = questionQueue.slice(i, questionQueue.length)
            return head.concat([incorrectQuestion]).concat(tail)
        },

        count: () => questionQueue.length,

        get: (i) => questionQueue[i],

        toList: () => questionQueue,

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
            let incorrectQuestion = questionQueue[currentIndex];
            let currentQuestionType = incorrectQuestion.type
            let i = currentIndex
            while (i < questionQueue.length && questionQueue[i].type === currentQuestionType) {
                i += 1
            }

            let head = questionQueue.slice(0, i)
            let tail = questionQueue.slice(i, questionQueue.length)
            let newQuestionQueueList = head.concat([incorrectQuestion]).concat(tail)

            return QuestionQueue(newQuestionQueueList, currentIndex + 1)
        }
    }
}