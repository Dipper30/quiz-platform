/* eslint-disable react/no-array-index-key */
import { createRef, useEffect, useRef, useState } from 'react'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Tag } from 'antd'
import api from '../..//http'
import { handleResult } from '../../utils'
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
  part: PartType,
  editing: Editing,
}

const PartDetail: React.FC<PartDetailProps> = (props) => {

  let timer: any = null
  const [collapsed, setCollapsed] = useState(true)
  const [questions, setQuestions] = useState<QuestionType[]>([])
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
    const res = await api.getQuestionsByPartId((props.part.id) as number, 0, true)
    if (!handleResult(res, false)) return
    const { data } = res
    const { partId, questions } = data
    setQuestions(questions)
    resize()
  }

  const resize = () => {
    if (timer) return 
    setTimeout(() => {
      partRef.current.style.height = collapsed ? '60px' :
      `${ questionsRef.current.clientHeight + 70 }px`
      clearTimeout(timer)
    }, 0)
  }

  const updateQuestion = (question: QuestionType) => {
    getQuestionsByPartId()
    // questions.push(question)
    // setQuestions(deepClone(questions))
  }

  const deleteQuestion = async (qid: number) => {
    const res = await api.deleteQuestionById(qid)
    if (!handleResult(res)) return
    getQuestionsByPartId()
  }

  const partChoiceList = props.part.choices?.map((partchoice: PartChoiceType, index: number) => (
    <div key={partchoice.id}> { `${choiceSeq[index + 1]}. ${partchoice.description} ${partchoice.show_sub ? '' : '(will not show sub questions)'}` } </div>
  )) || []

  const questionList = questions?.map((question: QuestionType, index: number) => (
    <div className='admin-question-container' key={question.id}>
      <span> {index + 1}. </span>
      <Button className='delete-btn' danger onClick={() => deleteQuestion(question.id || 0)}> Delete </Button>
      { question.description } &nbsp;
      { question.is_multi ? <Tag color='green'> Multi </Tag> : '' }
      {`(associated with ${ question.partChoices && question.partChoices.map((pc: PartChoiceType) => choiceSeq[props.part?.choices?.findIndex((choice: PartChoiceType) => choice.seq == pc.seq) + 1]).join(', ') })`}
      
      { question.imgList?.length && (
        <div className='img-container'>
          { question.imgList.map((imgSrc: any, index) => <img key={index} src={`data:image/${imgSrc.type};base64,${imgSrc.data}`} alt='img' />) }
        </div>
      ) }
      { question.choices.map((c: any) => {
          return (
            <div key={c.id}> {choiceSeq[c.seq] }. { c.description } <span className='answer-label'> { c.score > 0 ? c.score : '' } </span> </div> 
          )
        })
      }
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