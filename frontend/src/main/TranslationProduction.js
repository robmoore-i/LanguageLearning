export function TranslationProduction(given, answer, variableNames) {
    return {
        using: (inputs) => {
            let inputValues = variableNames.map((variable) => inputs[variable])
            return {
                type: 0,
                given: given.apply(this, inputValues),
                answer: answer.apply(this, inputValues)
            }
        }
    }
}