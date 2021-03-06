import { useEffect, useMemo, useState } from 'react'
import { errorMessage, handleResult, successMessage } from '../utils'
import api from '../http'
import QuizAbstract from '../components/admin/QuizAbstract'
import { useNavigate } from 'react-router-dom'
import './Home.less'
import MyButton from '@/components/Button'

const Home: React.FC<any> = (props: any) => {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<QuizType[]>([])
  const [quiz, setQuiz] = useState<QuizType>()

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    const res = await api.getQuizzesInfo()
    if (!handleResult(res, false)) return
    const { data } = res
    data.quizzes.length && getQuizById(data.quizzes[0].id)
    data.quizzes.length && setQuizzes(data.quizzes)
  }

  const enterQuiz = async (id?: number) => {
    if (id) {
      navigate(`quiz/${id}`)
    } else if (quizzes.length) {
      const qid = quizzes[0].id
      navigate(`quiz/${qid}`)
    } else {
      errorMessage('No quiz available!')
      return
    }
  }

  const getQuizById = async (qid: number) => {
    const res = await api.getQuizById(qid)
    if (!handleResult(res, false)) return
    setQuiz(res.data.quiz)
  }

  return (
    <div className='home-container'>
      <header className='welcome-header'> Welcome to OGD Literacy Test </header>
      <br />
      <br />
      <p>
        This test attempts to privide you with a general idea about your open government data (OGD) literacy.
      </p>
      <p>
        This test includes { quiz?.sections?.length || 0 } sections of pertinent knowlege and skills, including
        <b> { quiz?.sections?.length && quiz.sections.reduce((prev, cur, index) => prev += (cur.title + (index === quiz.sections.length - 1 ? '. ' : ', ')), '') } </b>
      </p>
      <p>
        Ready for your jouney?
      </p>
      <br />
      <br />

      <MyButton style='right' onClick={() => enterQuiz()}> START </MyButton>
    </div>
  )
}

export default Home