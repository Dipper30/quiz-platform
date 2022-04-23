import './Quiz.less'
import { useEffect, useState } from 'react'
import api from '../../http'
import { errorMessage, handleResult } from '../../utils'
import { Quiz as QuizType } from '../../vite-env'
import QuizAbstract from './QuizAbstract'

type QuizProps = {
  
}

const Quiz: React.FC<QuizProps> = (props) => {

  const [quizzes, setQuizzes] = useState<QuizType[]>([])

  const getQuizzesInfo = async () => {
    const res = await api.getAllQuizzesInfo()
    if (!handleResult(res, false)) return
    setQuizzes(res.data.quizzes)
  }

  useEffect(() => {
    getQuizzesInfo()
  }, [])

  const quizList = quizzes.map(quiz => (
    <QuizAbstract
      clickable={true}
      key={quiz.id}
      quiz={quiz}
      withDomain={false}
      withButton={true}
      withTag={true}
      update={getQuizzesInfo}
    />
  ))

  return (
    <div className='admin-quiz-container'>
      {quizList}
    </div>
  )
}

export default Quiz