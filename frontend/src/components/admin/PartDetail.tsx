import { createRef, useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import { Editing, Part, PartChoice, Question } from '../../vite-env'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import api from '../..//http'
import { deepClone, handleResult } from '../../utils'
import { CreateQuestion } from './CreateQuestion'
import { choiceSeq } from '../../config/choices'

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

  let timer: any = null
  const [collapsed, setCollapsed] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const partRef = useRef<any>()
  const questionsRef = useRef<any>()
  const newQuestionRef = useRef<any>()

  useEffect(() => {
    resize()
  }, [collapsed])

  useEffect(() => {
    getQuestionsByPartId()
  }, [])

  // useEffect

  const getQuestionsByPartId = async () => {
    const res = await api.getQuestionsByPartId((props.part.id) as number)
    if (!handleResult(res, false)) return
    const { data } = res
    const { partId, questions } = data
    setQuestions(questions)
    resize()
  }

  const resize = () => {
    if (timer) return 
    console.log('@@@@resize', questionsRef.current.clientHeight)
    setTimeout(() => {
      partRef.current.style.height = collapsed ? '60px' :
      `${ questionsRef.current.clientHeight + 70 }px`
      clearTimeout(timer)
    }, 0)
  }

  const updateQuestion = (question: Question) => {
    getQuestionsByPartId()
    // questions.push(question)
    // setQuestions(deepClone(questions))
  }

  const partChoiceList = props.part.choices?.map((partchoice: PartChoice, index: number) => (
    <div key={partchoice.id}> { `${choiceSeq[index + 1]}. ${partchoice.description} ${partchoice.show_sub ? '' : '(will not show sub questions)'}` } </div>
  )) || []

  const questionList = questions?.map((question: Question) => (
    <div className='question-container' key={question.id}>
      { question.description } &nbsp;
      {`(associated with ${ question.partChoices && question.partChoices.map((pc: PartChoice) => choiceSeq[props.part?.choices?.findIndex((choice: PartChoice) => choice.seq == pc.seq) + 1]).join(', ') })`}
      { question.choices.map(c => {
        return (
          <div key={c.id}> {choiceSeq[c.seq] }. { c.description } </div>
        )
      }) }
    </div>
  )) || []

  return (
    <div ref={partRef} className='admin-part-detail-container'>

      <div className='header' onClick={() => setCollapsed(!collapsed)}>
      { props.part.sectionName } / { props.part.domainName } / { props.part.name } ( { questions.length } ) Total Points: { props.part.totalPoints }
        <div className='icon' >
          { collapsed ? <RightOutlined /> : <DownOutlined /> }
        </div>
      </div>
      <div className='question-list-container' ref={questionsRef} >
        { partChoiceList }
        { questionList }
        <CreateQuestion
          resize={resize}
          update={updateQuestion}
          part={props.part}
          createQuestion={function (): void {
          throw new Error('Function not implemented.')
        } } />
      </div>
      
    </div>
  )
}

export default PartDetail