import './Quiz.less'
import { useEffect, useState } from 'react'
import { getQuizzesInfo } from '../../http/config'
import { errorMessage, handleResult } from '../../utils'
import { APIResponse, Domain, Quiz as QuizType } from '../../vite-env'
import QuizAbstract from './QuizAbstract'

type QuizProps = {
  
}

const Quiz: React.FC<QuizProps> = (props) => {

  const [quizzes, setQuizzes] = useState<QuizType[]>([])

  useEffect(() => {
    getQuizzesInfo().then(
      (res) => {
        if (!handleResult(res, false)) return
        setQuizzes(res.data.quizzes)
      },
    ).catch(err => errorMessage(err))
  }, [])

  const quizList = quizzes.map(quiz => <QuizAbstract key={quiz.id} quiz={quiz} />)

  return (
    <div className='admin-quiz-container'>
      {quizList}
    </div>
  )
}

export default Quiz