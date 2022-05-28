import { useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import api from '../http'
import { useNavigate, useParams } from 'react-router-dom'
import { withRouter } from '../utils/pureFunctions'
import { deepClone, errorMessage, handleResult } from '../utils'
import './Quiz.less'
import QuizPart from './QuizPart'
import { useDispatch } from 'react-redux'
import { setLoading, setResult } from '@/store/actions/result'

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
  const dispatch = useDispatch()

  useEffect(() => {
    const quizId = Number(params.id)
    setQuizId(quizId)
    setSubmission({ quizId, parts: [] })
    onStart(quizId)
  }, [])

  const getParts = (quiz: any) => {
    return quiz?.sections?.length ?
      quiz.sections.reduce(
        (prev: any, section: any, index: number) =>
          [...prev, ...section.domains.reduce(
          (prev: any, domain: any) => [...prev, ...domain.parts.map(
            (part: any) => {
              part.domainName = domain.name || 'domain'
              part.sectionName = section.title || 'section'
              part.sectionIndex = index + 1
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

  const onStart = (quizId: number) => {
    getQuizById(quizId)
  }

  const getQuizById = async (qid: number) => {
    //
    const res = await api.getQuizById(qid)
    if (!handleResult(res, false)) return
    setQuiz(res.data.quiz)
    setState('undergoing')
    const parts = getParts(res.data.quiz)
  }

  const updatePart = (newPart: SubmissionPart) => {
    let hasRecord = false
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
  }

  const submitQuiz = async () => {
    dispatch(setLoading(true))
    api.submitQuiz(submission).then(res => {
      if (!handleResult(res)) return
      const { data } = res
      dispatch(setResult(data.quiz))
      dispatch(setLoading(false))
    })
    .catch(err => {
      errorMessage(err)
      dispatch(setLoading(false))
    })
    navigate('/result')
  }

  const goNextPart = async () => {
    if (parts.length > currentPartIndex + 1) {
      setPartId(parts[currentPartIndex + 1].id)
      setCurrentPartIndex(currentPartIndex + 1)
    } else {
      submitQuiz()
    }
  }

  return (
    <div className='quiz-container'>
      {
        state == 'before' && (
          <h1> Loading... </h1>
          // <Button className='start-btn' onClick={onStart} loading={lock}> Start Quiz </Button>
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
              reachEnd={parts.length === currentPartIndex + 1}
              goNext={goNextPart}
            />
          ))
        )
      }
      
    </div>
  )
}

export default Quiz