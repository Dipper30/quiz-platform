import { Quiz as QuizType } from '../../vite-env'
import { Tag } from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

type QuizAbstractProps = {
  quiz: QuizType,
}

const QuizAbstract: React.FC<QuizAbstractProps> = (props) => {

  const navagate = useNavigate()
  const createdAt = useMemo(() => props.quiz.createdAt, [props.quiz.createdAt])

  const onQuizDetail = () => {
    navagate(`/admin/quiz/${props.quiz.id}`)
  }

  return (
    <div className='admin-quiz-abstract-container' onClick={onQuizDetail}>
      <div className='header'>
        <div> {props.quiz.title} </div>
        <Tag color='geekblue'> { props.quiz.tag } </Tag>
      </div>
       
      <div className='row'>
        <div className='col'>
          { `Total Points: ${props.quiz.totalPoints}` } 
        </div>
        <div className='col'>
          { `Created At: ${props.quiz.createdAt}` } 
        </div>
      </div>
      <div className='row'>
        { `Descriptions: ${props.quiz.description}` } 
      </div>
    </div>

  )
}

export default QuizAbstract