import { Button } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { handleResult, successMessage } from '../utils'
import api from '../http'
import { Quiz } from '../vite-env'
import QuizAbstract from '../components/admin/QuizAbstract'
import { getQuizById } from '../http/config'
import { useNavigate } from 'react-router-dom'

const Home: React.FC<any> = (props: any) => {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    const res = await api.getAllQuizzesInfo()
    console.log(res)
    if (!handleResult(res, false)) return
    const { data } = res
    setQuizzes(data.quizzes)
  }

  const enterQuiz = async (id: number) => {
    navigate(`quiz/${id}`)
  }

  const quizList = quizzes.map((quiz) => (
    <QuizAbstract
      key={quiz.id}
      quiz={quiz}
      clickable={true}
      withDomain={false}
      withButton={false}
      withTag={false}
      onQuizDetail={() => enterQuiz(quiz.id)}
    />
  ))

  return (
    <>
      <h1>Select Quiz and Start Test!</h1>
      <div>
        { quizList }
      </div>
    </>
  )
}

export default Home