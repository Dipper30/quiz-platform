import { Quiz as QuizType } from '../../vite-env'
import { Tag, Button } from 'antd'
import api from '../../http'
import { useNavigate } from 'react-router-dom'
import { handleResult, warningMessage } from '../../utils'
import { useState } from 'react'

type QuizAbstractProps = {
  quiz: QuizType,
  clickable: boolean,
  withDomain: boolean,
  deleted?: () => void,
}

const QuizAbstract: React.FC<QuizAbstractProps> = (props) => {

  const navagate = useNavigate()
  const [lock, setLock] = useState<boolean>(false)

  const onQuizDetail = () => {
    props.clickable && navagate(`/admin/quiz/${props.quiz.id}`)
  }

  const onDelete = async (e: any) => {
    e.stopPropagation()
    if (lock) {
      warningMessage('Wait a Sec')
      return
    }
    setLock(true)
    const deleted = await api.deleteQuiz(props.quiz.id)
    setLock(false)
    if (!handleResult(deleted)) return
    props.deleted && props.deleted()
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
        { !props.withDomain &&
          <Button danger className='delete-btn' onClick={onDelete}> Delete </Button>
        }
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