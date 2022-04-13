import { createRef, useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import { Editing, Part } from '../../vite-env'
import { RightOutlined, DownOutlined } from '@ant-design/icons'

type PartHeaderProps = {
  
}

const PartHeader: React.FC<PartHeaderProps> = (props) => {
  return (
    <div className=''>
      PartHeader
    </div>
  )
}

type PartDetailProps = {
  part: Part,
  editing: Editing,
}

const PartDetail: React.FC<PartDetailProps> = (props) => {

  const [collapsed, setCollapsed] = useState(true)
  const [questions, setQuestions] = useState([1, 2, 3 ])
  const partRef = useRef<any>()
  const questionRef = useRef<any>()

  useEffect(() => {
    (partRef.current as any).style.height = collapsed ? '60px' : `${ questionRef.current.clientHeight + 70 }px`

  }, [collapsed])

  useEffect

  const getQuestionsByPartId = () => {
    
  }

  const questionList = questions.map((question: any) => (
    <div className='question-container' key={question}>
      {question}
    </div>
  ))

  return (
    <div ref={partRef} className='admin-part-detail-container'>

      <div className='header' onClick={() => setCollapsed(!collapsed)}>
        { props.part.domainName } / { props.part.name } ( { props.part.totalPoints } )
        <div className='icon' >
          { collapsed ? <RightOutlined /> : <DownOutlined /> }
        </div>
      </div>
      <div className='question-list-container' ref={questionRef} >
        { questions.map((question: any) => (
          <div className='question-container' key={question}>
            {question}
          </div>))
        }
      </div>
    </div>
  )
}

export default PartDetail