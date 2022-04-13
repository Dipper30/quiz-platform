import { useEffect, useState } from 'react'
import { Choice, Question } from '../../vite-env'
import { Input, InputNumber, Button, Checkbox } from 'antd'
import { deepClone, errorMessage, handleResult } from '../../utils'
import { CloseCircleOutlined } from '@ant-design/icons'
import api from '../../http'
import './CreateQuestion.less'

const { TextArea } = Input

type CreateChoiceProps = {
  questionId: number,
  choice: Choice,
  createChoice?: () => void,
  update: (choice: Choice, seq: number) => void,
  delete?: (seq: number) => void
}

const initChoice = {
  description: 'New Choice...',
  seq: 1,
  score: 0,

}

export const CreateChoice: React.FC<CreateChoiceProps> = (props) => {

  const [choice, setChoice] = useState<Choice>(deepClone(props.choice))

  useEffect(() => {
    if (props.choice) setChoice(props.choice)
    return () => setChoice(initChoice)
  }, [props.choice])

  const updateChoiceInfo = (key: string, value: any) => {
    switch (key) {
      case 'score':
        choice.score = value
        break
      case 'description':
        choice.description = value
        break
    }
    setChoice(deepClone(choice))
    props.update(choice, choice.seq)
  }

  const delelteChoice = () => {
    props.delete && props.delete(choice.seq)
  }

  return (
    <div className='admin-create-choice-container'>
      <div className="row">
        <Input
          value={choice.description}
          onInput={(e: any) => updateChoiceInfo('description', e.target.value)}
        />
        &nbsp;Score:&nbsp;
        <InputNumber
          min={0}
          max={100}
          value={choice.score}
          onChange={(e: any) => updateChoiceInfo('score', e)}
        />{choice.seq}
        { choice.score > 0 && (<span className='answer'> Answer! </span>)}
        &nbsp;&nbsp;<CloseCircleOutlined className='delete-btn' onClick={delelteChoice} />
      </div>

    </div>
  )
}

type CreateQuestionProps = {
  partId: number,
  createQuestion: () => void,
  resize?: () => void,
  update: (question: Question) => void,
}

const initChoices: Choice[] = [
  {
    description: 'Wrong Choice',
    seq: 1,
    score: 0,
  },
  {
    description: 'Correct Choice',
    seq: 2,
    score: 3,
  },
]

const initQuestion: Question = {
  description: 'Question Descriptions Here...',
  seq: 0,
  partId: 0,
  isMulti: false,
  choices: initChoices,
}

export const CreateQuestion: React.FC<CreateQuestionProps> = (props) => {

  const [question, setQuestion] = useState<Question>(initQuestion)
  const [init, setInit] = useState<boolean>(false)
  const [lock, setLock] = useState<boolean>(false)

  const updateQuestionInfo = (key: string, value: any) => {
    console.log(value)
    switch (key) {
      case 'description':
        question.description = value
        break
      case 'isMulti':
        question.isMulti = value
        break
      case 'choice':
        question.choices
    }
    setQuestion(deepClone(question))
  }

  const addChoice = () => {
    const choice = deepClone(initChoice)
    choice.seq = question.choices.length + 1
    question.choices.push(choice)
    setQuestion(deepClone(question))
    props.resize && props.resize()
  }

  const deleteChoice = (seq: number) => {
    question.choices = question.choices.filter(c => c.seq != seq).map(c => {
      if (c.seq > seq) c.seq--
      return c
    })
    setQuestion(deepClone(question))
  }

  const dropQuestion = () => {
    setQuestion(deepClone(initQuestion))
    setInit(false)
    props.resize && props.resize()
  }

  const addQuestion = () => {
    setQuestion(deepClone(initQuestion))
    setInit(true)
    props.resize && props.resize()
  }

  const onSubmit = async () => {
    question.partId = props.partId
    if (lock || !validate()) return
    setLock(true)
    const res = await api.createQuestion(question)
    setLock(false)
    if (!handleResult(res)) return
    dropQuestion()
    props.update(res.data.question)
  }

  const validate = () => {
    if (!question.description || question.choices.length == 0) {
      errorMessage('Please complete required fields.')
      return false
    }
    let sum = 0
    if (question.choices.reduce((prev, cur) => {
      if (cur.score > 0) sum++
      return prev + cur.score
    }, 0) <= 0) {
      errorMessage('Please set at least one choice as correct.')
      return false
    }
    if ((sum > 1 && !question.isMulti) || (sum == 1 && question.isMulti)) {
      errorMessage('Please check if there are more than one correct answer.')
      return false
    }
    return true
  }

  const choiceList = question.choices.map((choice, index: number) => (
    <div className='row' key={choice.seq}>
      <div className='seq'> {index}. </div>
      <CreateChoice
        choice={choice}
        questionId={question.id || 0}
        delete={deleteChoice}
        update={(choice, seq) => updateQuestionInfo('choice', { choice, seq })}
      />
    </div>
  ))

  return (
    <div className='admin-create-question-container'>
      {
        !init ? <Button onClick={addQuestion}> Add Question </Button> :
        (
          <div>
            <div className='row'>
              Question has more than one correct choice ? &nbsp;
              {/* TODO debounce */}
              <Checkbox checked={question.isMulti} onChange={(e: any) => updateQuestionInfo('isMulti', e.target.checked)} />
            </div>
            <TextArea
              rows={4}
              value={question.description}
              // placeholder={question.description}
              onChange={(e: any) => updateQuestionInfo('description', e.target.value)}
            />
            { choiceList }
            <Button onClick={addChoice}> Add Choice </Button>
            <div className='row'>
              <Button type='dashed' onClick={dropQuestion}> Drop </Button>
              <Button type='primary' onClick={onSubmit}> Create </Button>
            </div> 
          </div>
        )
      }
      
    </div>
  )
}
