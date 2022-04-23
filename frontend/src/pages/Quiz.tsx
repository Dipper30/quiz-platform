import { useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import api from '../http'
import { useParams } from 'react-router-dom'
import { withRouter } from '../utils/pureFunctions'
import { handleResult } from '../utils'
import './Quiz.less'
import QuizPart from './QuizPart'

type QuizProps = {
}

type StateType = 'before' | 'undergoing' | 'done' | 'submitted'

const Quiz: React.FC<QuizProps> = (props) => {
  const [lock, setLock] = useState<boolean>(false)
  const [partId, setPartId] = useState<number>(0)
  const [quizId, setQuizId] = useState<number>(0)
  const [quiz, setQuiz] = useState<any>(null)
  const [state, setState] = useState<StateType>('before')
  const params = useParams()

  useEffect(() => {
    setQuizId(Number(params.id))
  }, [])

  const parts = useMemo(() => quiz ?
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
    : [], [quiz])

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
    setState('undergoing')
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
            />
          ))
        )
      }
      
    </div>
  )
}

export default Quiz