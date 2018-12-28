export function randomChoice(choicesArray) {
  var index = Math.floor(Math.random() * choicesArray.length)
  return choicesArray[index]
}
