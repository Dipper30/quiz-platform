import { useEffect, useState } from 'react'
import { choiceSeq } from '../config/choices'
import { SubmissionChoice } from '../pages/Quiz'
import { deepClone } from '../utils'
import { Checkbox } from 'antd'
import './Question.less'

type QuestionProps = {
  question: QuestionType,
  seq: number,
  isSubQuestion: boolean,
  currentSelected?: number[],
  update: (choice: SubmissionChoice) => void
}

const Question: React.FC<QuestionProps> = (props) => {

  const [selectedPartChoices, setSelectedPartChoices] = useState<number[]>([])

  useEffect(() => {
    props.update({ qid: Number(props.question.id), cid: selectedPartChoices })
  }, [selectedPartChoices])

  const toggleSelected = (id: number) => {
    let hasRecord = false
    for (let i = 0; i < selectedPartChoices.length; i++) {
      if (selectedPartChoices[i] === id) {
        selectedPartChoices.splice(i, 1)
        hasRecord = true
        break
      }
    }

    if (props.question.is_multi) {
      if (!hasRecord) selectedPartChoices.push(id)
      setSelectedPartChoices(deepClone(selectedPartChoices))
    } else {
      hasRecord ? setSelectedPartChoices([]) : setSelectedPartChoices([id])
    }
  }

  return (
    <div className='question-container'>
      <div className='description'>
        { props.question?.description ||
          `In this part, we will focus on ${props.question.name}.`
        }
        { props.question.isMulti &&
          <span> Multiple choices </span>
        }
      </div>
      <div className='choice-list'>
        {
          props.question.choices.map((c: ChoiceType, index: number) => (
            <div key={c.id} className='choice-container'>
              <Checkbox
                checked={props.isSubQuestion ? props.currentSelected?.includes(Number(c.id)) : selectedPartChoices.includes(Number(c.id))}
                onClick={() => toggleSelected(Number(c.id))}
              />
              <div
                key={c.id}
                className='choice'
                onClick={() => toggleSelected(Number(c.id))}
              >
                { props.isSubQuestion ? `${choiceSeq[index + 1]}.  ` : '' }
                { c.description }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Question