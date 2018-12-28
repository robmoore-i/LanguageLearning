export function randomChoice(choicesArray) {
  var index = Math.floor(Math.random() * choicesArray.length);
  return choicesArray[index];
}

export function Shuffler() {
    function shuffleChoices(mcq) {
        return mcq
    }

    return {
        shuffleChoices: shuffleChoices
    }
}
