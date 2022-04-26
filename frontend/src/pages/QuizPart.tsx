import { useState } from 'react'
import { choiceSeq } from '../config/choices'
import { Checkbox, Button } from 'antd'
import { SubmissionChoice, SubmissionPart } from './Quiz'
import Question from '../components/Question'
import { Choice, Question as IQuestion } from '../vite-env'

import { deepClone, errorMessage, handleResult } from '../utils'
import api from '../http'

type QuizPartProps = {
  part: any,
  currentPartId: number,
  visible: boolean,
  update: (part: SubmissionPart) => void
  goNext: () => void
}

const QuizPart: React.FC<QuizPartProps> = (props) => {

  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [selected, setSelected] = useState<boolean>(false)
  const [submissionPart, setSubmissionPart] = useState<SubmissionPart>(
    {
      pid: props.currentPartId,
      pcid: 0,
      choices: [],
    },
  )

  const confirmPartChoice = async () => {
    // get questions according what user selected
    if (submissionPart.pcid === 0) {
      errorMessage('Please select your choice.')
      return
    }
    const res = await api.getQuestionsByPartId(
      props.currentPartId,
      submissionPart.pcid,
      false,
    )
    if (!handleResult(res, false)) return
    setSelected(true)
    if (!res.data.questions.length) {
      props.goNext()
      return
    }
    // render questions
    setQuestions(res.data.questions)
  }

  const updatePartChoice = (choice: SubmissionChoice) => {
    const { qid, cid } = choice
    submissionPart.pcid = cid.length > 0 ? cid[0] : 0
    setSubmissionPart(deepClone(submissionPart))
  }

  const updateQuestion = (choice: SubmissionChoice) => {
    const { qid, cid } = choice
    let hasRecord = false
    for (let i = 0; i < submissionPart.choices.length; i++) {
      if (submissionPart.choices[i].qid === qid) {
        submissionPart.choices[i].cid = cid
        hasRecord = true
        break
      }
    }
    if (!hasRecord) {
      submissionPart.choices.push(choice)
    }
    setSubmissionPart(deepClone(submissionPart))
  }

  return (
    <>
      {
        props.visible && !selected ?
          <div>
            <div className='part-container'>
              <Question
                question={props.part}
                seq={1}
                update={updatePartChoice}
              />
            </div>
            <Button onClick={confirmPartChoice}> Confirm </Button>
          </div>
        : (
            <div className='question-list'>
              {questions.map((q: IQuestion, index: number) => (
                <Question
                  key={q.id}
                  question={q}
                  seq={index + 1}
                  update={updateQuestion}
                />
              ))}
            </div>
        )
      }
    </>

  )
}

export default QuizPart