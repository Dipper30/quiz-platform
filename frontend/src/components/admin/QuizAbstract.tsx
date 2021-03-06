import { Tag, Button, Popover } from 'antd'
import api from '../../http'
import { useNavigate, useLocation } from 'react-router-dom'
import { handleResult, warningMessage } from '../../utils'
import { useState } from 'react'
import { apiBaseURL } from '../../http/api'

type QuizAbstractProps = {
  quiz: QuizType,
  clickable: boolean,
  withDomain: boolean,
  withButton: boolean,
  withTag: boolean,
  update?: () => void,
  onQuizDetail?: () => void,
}

const QuizAbstract: React.FC<QuizAbstractProps> = (props) => {
  const location = useLocation()
  const navagate = useNavigate()
  const [lock, setLock] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const onQuizDetail = () => {
    props.clickable && navagate(`/admin/quiz/${props.quiz.id}`)
  }

  const onDelete = async (e: any) => {
    e && e.stopPropagation()
    if (lock) {
      warningMessage('Wait a Sec')
      return
    }
    setLock(true)
    const deleted = await api.deleteQuiz(props.quiz.id)
    setLock(false)
    if (!handleResult(deleted)) return
    props.update && props.update()
  }

  const toggleVisibility = async (e: any) => {
    e && e.stopPropagation()
    if (lock) {
      warningMessage('Wait a Sec')
      return
    }
    setLock(true)
    const toggled = await api.toggleVisibility(props.quiz.id)
    setLock(false)
    if (!handleResult(toggled)) return
    props.update && props.update()
  }

  /**
   * download a csv file
   */
  const getRecords = async (e: any) => {
    e && e.stopPropagation()
    if (lock) {
      warningMessage('Wait a Sec')
      return
    }
    setLock(true)
    const path = apiBaseURL + '/records/' + props.quiz.id
    window.open(path, '_blank')
    setLock(false)
    // if (!handleResult(downloaded)) return
  }

  const getDetailedRecords = async (e: any) => {
    e && e.stopPropagation()
    if (lock) {
      warningMessage('Wait a Sec')
      return
    }
    setLock(true)
    const path = apiBaseURL + '/detailedRecords/' + props.quiz.id
    window.open(path, '_blank')
    setLock(false)
  }

  const onDeleteTip = (e: any) => {
    e && e.stopPropagation()
  }

  const onDeleteCancelled = (e: any) => {
    e && e.stopPropagation()
    setVisible(false)
  }

  const handleVisibleChange = (v: boolean) => {
    setVisible(v)
  }

  return (
    <div
      className={`admin-quiz-abstract-container
        ${props.clickable ?' clickable' : ''}
        ${props.withDomain ?' hover' : ''}
      `}
      onClick={props.onQuizDetail ? props.onQuizDetail : onQuizDetail}
    >
      <div className='header'>
        <div> {props.quiz.title} </div> &nbsp;
        { props.withTag && ( props.quiz.visible ? <Tag color='green'> visible </Tag> : <Tag color='grey'> insivible </Tag> ) }
        { props.withTag && props.quiz.tag && <Tag color='geekblue'> { props.quiz.tag } </Tag> }
        { props.withButton &&
          <div className='btn-group'>
            <Button className='btn' onClick={getRecords}> Download Records </Button>
            <Button className='btn' onClick={getDetailedRecords}> Download Detailed Records </Button>
            <Button className='btn' onClick={toggleVisibility}> Toggle Visibility </Button>
            <Popover
              content={(
                <div>
                  <Button onClick={onDeleteCancelled}> No </Button>
                  <Button danger className='btn' onClick={onDelete}> Yes </Button>
                </div>
              )}
              title='Are you sure to delete this quiz?'
              trigger="click"
              visible={visible}
              onVisibleChange={handleVisibleChange}
            >
              <Button danger onClick={onDeleteTip}>Delete</Button>
            </Popover>
            
          </div>
        }
      </div>
       
      <div className='row'>
        <div className='col'>
          { `Total Points: ${props.quiz.total_points}` } 
        </div>
        {
          props.withTag && (
            <div className='col'>
              { `Created At: ${props.quiz.createdAt}` } 
            </div>
          )
        }
      </div>
      
      <div className='row'>
        { `Descriptions: ${props.quiz.description}` } 
      </div>
      {
        props.withDomain && props.quiz?.sections?.length > 0 &&
        (
          props.quiz.sections.map((section: SectionType) => (
            <div key={section.id} className='proportion-list'>
              <div className='section-title'> {section.title }</div>
              <div className="domains">
                {
                  section.domains?.map(domain => (
                    <div className='domain-container' key={domain.id}>
                      <span className='domain-name'>{ domain.name }</span> &nbsp; <span>{ domain.proportion } %</span> 
                    </div>
                  )) || []
                }
              </div>
            </div>
          ))
        )
      }
    </div>

  )
}

export default QuizAbstract