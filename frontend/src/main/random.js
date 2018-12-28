export function randomChoice(choicesArray) {
  var index = Math.floor(Math.random() * choicesArray.length)
  return choicesArray[index]
}

export function coinFlip() {
    return randomChoice([true, false])
}
