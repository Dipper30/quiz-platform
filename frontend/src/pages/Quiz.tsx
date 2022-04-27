import { useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import api from '../http'
import { useNavigate, useParams } from 'react-router-dom'
import { withRouter } from '../utils/pureFunctions'
import { deepClone, handleResult } from '../utils'
import './Quiz.less'
import QuizPart from './QuizPart'

type QuizProps = {
}

type StateType = 'before' | 'undergoing' | 'done' | 'submitted'

export interface SubmissionChoice {
  qid: number,
  cid: number[],
}

export interface SubmissionPart {
  pid: number,
  pcid: number,
  choices: SubmissionChoice[],
}

export interface Submission {
  quizId: number,
  parts: SubmissionPart[],
}

const Quiz: React.FC<QuizProps> = (props) => {
  const [lock, setLock] = useState<boolean>(false)
  const [currentPartIndex, setCurrentPartIndex] = useState<number>(0)
  const [partId, setPartId] = useState<number>(0)
  const [quizId, setQuizId] = useState<number>(0)
  const [quiz, setQuiz] = useState<any>(null)
  const [state, setState] = useState<StateType>('before')
  const [submission, setSubmission] = useState<Submission>({
    quizId: 0,
    parts: [],
  })
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const quizId = Number(params.id)
    setQuizId(quizId)
    setSubmission({ quizId, parts: [] })
  }, [])

  const getParts = (quiz: any) => {
    return quiz ?
      quiz.sections.reduce(
        (prev: any, section: any) =>
          [...prev, ...section.domains.reduce(
          (prev: any, domain: any) => [...prev, ...domain.parts.map(
            (part: any) => {
              part.domainName = domain.name || 'domain'
              part.sectionName = section.title || 'section'
              return part
            })]
          , [])]
      , [])
      : []
  }

  const parts = useMemo(() => getParts(quiz), [quiz])

  useEffect(() => {
    parts.length > 0 && setPartId(parts[0].id)
  }, [parts])

  const onStart = () => {
    if (lock) return
    setLock(true)
    getQuizById(quizId)
  }

  const getQuizById = async (qid: number) => {
    //
    const res = await api.getQuizById(qid)
    setLock(false)
    if (!handleResult(res, false)) return
    setQuiz(res.data.quiz)
    console.log(res.data.quiz)
    setState('undergoing')
    const parts = getParts(res.data.quiz)
  }

  const updatePart = (newPart: SubmissionPart) => {
    const { pid } = newPart
    let hasRecord = false
    console.log('current ', submission)
    console.log('get ', newPart)
    for (let part of submission.parts) {
      if (part.pid === newPart.pid) {
        hasRecord = true
        part = newPart
        break
      }
    }
    if (!hasRecord) {
      submission.parts.push(newPart)
    }
    setSubmission(deepClone(submission))
    setTimeout(() => console.log(submission), 10)
    
  }

  const submitQuiz = async () => {
    console.log('submit ! ', submission)
    const res = await api.submitQuiz(submission)
    if (!handleResult(res)) return
    const { data } = res
    navigate('/result', { state: { quiz: data.quiz } })
  }

  const goNextPart = () => {
    if (parts.length > currentPartIndex + 1) {
      setPartId(parts[currentPartIndex + 1].id)
      setCurrentPartIndex(currentPartIndex + 1)
    } else {
      submitQuiz()
      console.log('reach end of quiz!')
    }
  }

  return (
    <div className='quiz-container'>
      {
        state == 'before' && (
          <Button className='start-btn' onClick={onStart} loading={lock}> Start Quiz </Button>
        )
      }
      {
        state == 'undergoing' && (
          parts.map((part: any) => (
            <QuizPart
              key={part.id}
              currentPartId={partId}
              part={part}
              visible={partId===part.id}
              update={updatePart}
              goNext={goNextPart}
            />
          ))
        )
      }
      
    </div>
  )
}

export default Quiz