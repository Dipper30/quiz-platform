import { useEffect, useState } from 'react'
import { SubmissionChoice, SubmissionPart } from './Quiz'
import Question from '@/components/Question'
import QuestionList from '@/components/QuestionList'
import SectionTitle from '@/components/SectionTitle'
import PartTitle from '@/components/PartTitle'
import MyButton from '@/components/Button'
import { deepClone, errorMessage, handleResult } from '../utils'
import api from '../http'
import './QuizPart.less'

type QuizPartProps = {
  part: any,
  currentPartId: number,
  visible: boolean,
  reachEnd: boolean,
  update: (part: SubmissionPart) => void
  goNext: () => void
}

const QuizPart: React.FC<QuizPartProps> = (props) => {

  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [selected, setSelected] = useState<boolean>(false) // current part selected
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [submissionPart, setSubmissionPart] = useState<SubmissionPart>(
    {
      pid: props.part.id,
      pcid: 0,
      choices: [],
    },
  )

  useEffect(() => {
    return () => {
      setQuestions([])
    }
  }, [])

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
    setLoading(true)
    if (submissionPart.pcid === 0) {
      errorMessage('Please select your choice.')
      setLoading(false)
      return
    }
    await getQuestions()
    setLoading(false)
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
  const submitQuestions = async () => {
    // make sure all questions are answered
    if (submissionPart.choices.length < questions.length) {
      errorMessage('Please complete all questions')
        setLoading(false)
        return
    }
    for (const choice of submissionPart.choices) {
      if (!choice.cid.length) {
        errorMessage('Please complete all questions')
        setLoading(false)
        return
      }
    }
    props.update(submissionPart)
    setLoading(true)
    await props.goNext()
    setLoading(false)
  }

  const onNextPart = () => {
    if (props.reachEnd) {
      setShowDialog(true)
    } else {
      confirmPartChoice()
    }
  }

  return (
    <>
      { props.visible && (
        <>
        {
          showDialog && (
            <div className='confirm-dialog'>
              <div className='dialog'>
                <p> Note: This is the last section of the quiz. After you finish this section, your answers will be submitted.</p>
                <div className='btns'>
                  <div className='btn grey' onClick={() => setShowDialog(false)}>
                    CANCEL
                  </div>
                  <div className='btn' onClick={() => {
                    setShowDialog(false)
                    confirmPartChoice()
                  }}>
                    CONFIRM
                  </div>
                </div>
              </div>
             
            </div>
          )
        }
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
              <div className='buttons'>
                <div></div>
                <MyButton style='right' onClick={onNextPart} loading={loading}> NEXT </MyButton>
              </div>
            </div>
          ) : (
            <div className='question-list'>
              { questions?.length
                ? <QuestionList
                    questions={questions}
                    updateQuestion={updateQuestion}
                    submitQuestions={submitQuestions}
                    reachEnd={props.reachEnd}
                    loading={loading}
                  />
                : '' }
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