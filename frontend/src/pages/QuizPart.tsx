import { useEffect, useState } from 'react'
import { choiceSeq } from '../config/choices'
import { Checkbox, Button } from 'antd'
import { SubmissionChoice, SubmissionPart } from './Quiz'
import Question from '@/components/Question'
import SectionTitle from '@/components/SectionTitle'
import PartTitle from '@/components/PartTitle'

import { deepClone, errorMessage, handleResult } from '../utils'
import api from '../http'
import './QuizPart.less'

type QuizPartProps = {
  part: any,
  currentPartId: number,
  visible: boolean,
  update: (part: SubmissionPart) => void
  goNext: () => void
}

const QuizPart: React.FC<QuizPartProps> = (props) => {

  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [selected, setSelected] = useState<boolean>(false) // current part selected
  const [submissionPart, setSubmissionPart] = useState<SubmissionPart>(
    {
      pid: props.part.id,
      pcid: 0,
      choices: [],
    },
  )

  // useEffect(() => {

  // }, [props.currentPartId])

  const getQuestions = async () => {
    const res = await api.getQuestionsByPartId(
      props.part.id,
      submissionPart.pcid,
      false,
    )
    if (!handleResult(res, false)) return
    setSelected(true)
    if (!res.data.questions.length) {
      submitQuestions()
      return
    }
    
    // render questions
    setQuestions(res.data.questions)
  }

  const confirmPartChoice = async () => {
    // get questions according what user selected
    if (submissionPart.pcid === 0) {
      errorMessage('Please select your choice.')
      return
    }
    getQuestions()
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

  // submit questions of current part
  const submitQuestions = () => {
    // make sure all questions are answered
    for (const choice of submissionPart.choices) {
      if (!choice.cid.length) {
        errorMessage('Please complete all questions')
        return
      }
    }
    props.update(submissionPart)
    props.goNext()
  }

  return (
    <>
      { props.visible && (
        <>
        <SectionTitle>
          { `Section${props.part.sectionIndex}: ${props.part.sectionName}` }
        </SectionTitle>
        <div className='content-container'>
          <PartTitle> { `${!selected ? 'Self-Assesment: ' : ''}${props.part.name}` } </PartTitle>
        {
          !selected ? (
            <div>
              <div className='part-container'>
                <Question
                  isSubQuestion={false}
                  question={props.part}
                  seq={1}
                  update={updatePartChoice}
                />
              </div>
              <Button onClick={confirmPartChoice}> Confirm </Button>
            </div>
          ) : (
            <div className='question-list'>
              { questions && questions.map((q: QuestionType, index: number) => (
                <Question
                  key={q.id}
                  isSubQuestion={true}
                  question={q}
                  seq={index + 1}
                  update={updateQuestion}
                />
              )) }
              <Button onClick={submitQuestions}> Submit </Button>
            </div>
          )
        }
        </div>
        </>
      )}
    </>

  )
}

export default QuizPart