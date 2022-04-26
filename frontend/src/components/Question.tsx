import { useState } from 'react'
import { choiceSeq } from '../config/choices'
import { SubmissionChoice } from '../pages/Quiz'
import { deepClone } from '../utils'
import { Choice, Question as IQuestion } from '../vite-env'
import './Question.less'

type QuestionProps = {
  question: IQuestion,
  seq: number,
  update: (choice: SubmissionChoice) => void
}

const Question: React.FC<QuestionProps> = (props) => {

  const [selectedPartChoices, setSelectedPartChoices] = useState<number[]>([])

  const toggleSelected = (id: number) => {
    let hasRecord = false
    for (let i = 0; i < selectedPartChoices.length; i++) {
      if (selectedPartChoices[i] === id) {
        selectedPartChoices.splice(i, 1)
        hasRecord = true
        break
      }
    }
    if (!hasRecord) {
      selectedPartChoices.push(id)
    }
    setSelectedPartChoices(deepClone(selectedPartChoices))
    props.update({ qid: Number(props.question.id), cid: selectedPartChoices })
  }

  return (
    <div className='question-container'>
      <div className='description'>
        { props.seq }. &nbsp;
        { props.question.description ||
          `In this part, we will focus on ${props.question.name}.`
        }
      </div>
      <div className='choice-list'>
        {
          props.question.choices.map((c: Choice, index: number) => (
            <div
              key={c.id}
              className={ `choice${selectedPartChoices.includes(Number(c.id)) ? ' selected' : ''}` }
              onClick={() => toggleSelected(Number(c.id))}
            >
              { choiceSeq[index + 1] }. &nbsp;&nbsp;
              { c.description }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Question