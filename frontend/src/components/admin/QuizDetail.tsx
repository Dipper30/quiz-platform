import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../http'
import { handleResult } from '../../utils'
import { Part, Quiz } from '../../vite-env'
import PartDetail from './PartDetail'
import QuizAbstract from './QuizAbstract'
import './QuizDetail.less'

type QuizDetailProps = {
  
}

const initQuiz: Quiz = {
  title: '',
  tag: '',
  description: 'descriptions...',
  totalPoints: 100,
  domains: [],
}

const QuizDetail: React.FC<QuizDetailProps> = (props) => {

  const currentId = Number(useParams().id)
  const [quiz, setQuiz] = useState<Quiz>(initQuiz)
  const [parts, setParts] = useState<Part[]>([])

  const getQuizById = async (id: number) => {
    const res = await api.getQuizById(id)
    if (!handleResult(res, false)) return
    setQuiz(res.data.quiz)
    console.log(quiz)
  }

  useEffect(() => {
    getQuizById(currentId)
  }, [])

  useEffect(() => {
    const newParts = getParts()
    setParts(newParts)
  }, [quiz])

  const getParts = () => {
    let parts: Part[] = []
    for (const domain of quiz.domains) {
      domain.parts.map(p => p.domainName = domain.name)
      parts = [ ...parts, ...domain.parts]
    }
    return parts
  }

  const partDetailList = parts.map(part =>
    <PartDetail
      key={part.id}
      part={part}
      editing='editing'
    // eslint-disable-next-line comma-dangle
    />
  )

  return (
    <div className='admin-quiz-detail-container'>
      <QuizAbstract clickable={false} quiz={quiz} withDomain={true} />
      { partDetailList }
      <div style={{height: '2000px'}}></div>
    </div>
  )
}

export default QuizDetail