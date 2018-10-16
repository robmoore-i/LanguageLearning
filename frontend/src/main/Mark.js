import greentick from '../images/greentick.png'
import redcross from '../images/redcross.png'
import greyquestionmark from '../images/greyquestionmark.png'

let Mark = {
    UNMARKED:  {id: "question-result-unmarked",  img: greyquestionmark},
    CORRECT:   {id: "question-result-correct",   img: greentick},
    INCORRECT: {id: "question-result-incorrect", img: redcross}
}

export default Mark