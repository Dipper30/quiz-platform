import { Quiz as QuizType } from '../../vite-env'
import { Tag } from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

type QuizAbstractProps = {
  quiz: QuizType,
  clickable: boolean,
  withDomain: boolean,
}

const QuizAbstract: React.FC<QuizAbstractProps> = (props) => {

  const navagate = useNavigate()

  const onQuizDetail = () => {
    props.clickable && navagate(`/admin/quiz/${props.quiz.id}`)
  }

  return (
    <div
      className={`admin-quiz-abstract-container
        ${props.clickable ?' clickable' : ''}
        ${props.withDomain ?' hover' : ''}
      `}
      onClick={onQuizDetail}
    >
      <div className='header'>
        <div> {props.quiz.title} </div>
        { props.quiz.tag && <Tag color='geekblue'> { props.quiz.tag } </Tag> }
      </div>
       
      <div className='row'>
        <div className='col'>
          { `Total Points: ${props.quiz.total_points}` } 
        </div>
        <div className='col'>
          { `Created At: ${props.quiz.createdAt}` } 
        </div>
      </div>
      <div className='row'>
        { `Descriptions: ${props.quiz.description}` } 
      </div>

      {
        props.withDomain &&
        props.quiz.domains.map(domain => (
          <div className='domain-container' key={domain.id}>
            <span className='domain-name'>{ domain.name }</span> &nbsp; <span>{ domain.proportion } %</span> 
          </div>
        ))
      }
    </div>

  )
}

export default QuizAbstract