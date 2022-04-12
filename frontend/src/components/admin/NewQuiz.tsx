import { useEffect, useMemo, useState } from 'react'
import { Input, InputNumber, Button, Popconfirm } from 'antd'
import './NewQuiz.less'
import { deepClone, errorMessage, handleResult, isEmptyValue, successMessage } from '../../utils'
import { APIResponse, Domain, Quiz } from '../../vite-env'
import DomainItem from './form/DomainItem'
import api from '../../http'

const { TextArea } = Input

type AdminNewQuizProps = {
  
}

const initQuiz: Quiz = {
  title: 'MyQuiz',
  tag: '',
  description: 'descriptions...',
  totalPoints: 100,
  domains: [],
}

const AdminNewQuiz: React.FC<AdminNewQuizProps> = (props) => {

  const [quiz, setQuiz] = useState(initQuiz)
  const [domainId, setDomainId] = useState(Date.now())

  const calculateTotalProportion = (domains: Domain[]) => {
    return domains.reduce((pre, cur) => pre + cur.proportion, 0)
  }
  const currentTotalProportion = useMemo(() => calculateTotalProportion(quiz.domains), [quiz.domains])

  const domainList = quiz.domains?.map((domain: Domain, index: number) => (
    <DomainItem
      key={domain.id}
      domain={domain}
      update={(domain: Domain, seq: number) => updateQuizInfo('domains', { domain, seq })}
      deleteDomain={deleteDomain}
    />
  ))

  const updateQuizInfo = (key: string, value: any) => {
    switch (key) {
      case 'title':
        quiz.title = value
        break
      case 'tag':
        quiz.tag = value
        break
      case 'totalPoints':
        quiz.totalPoints = value
        break
      case 'description':
        quiz.description = value
        break
      case 'domain':
        // eslint-disable-next-line no-case-declarations
        const { domain, seq } = value
        quiz.domains[seq - 1] = domain
        break
    }
    setQuiz(deepClone(quiz))
  }

  const deleteDomain = (seq: number) => {
    if (seq == undefined) return
    quiz.domains.splice(seq - 1, 1)
    for (let index = seq - 1; index < quiz.domains.length; index++) {
      quiz.domains[index].seq--
    }
    setQuiz(deepClone(quiz))
  }

  const addNewDomain = () => {
    const domain = {
      domainName: 'new domain',
      proportion: Math.max(100 - currentTotalProportion, 0),
      seq: quiz.domains.length + 1,
      id: domainId,
      parts: [],
    }
    setDomainId(domainId + 1)
    quiz.domains = [...quiz.domains, domain]
    setQuiz(quiz)
  }

  const onSubmit = async () => {
    if (!validateForm()) return
    console.log('Submit Quiz: ', quiz)
    const res: APIResponse = await api.initQuiz(quiz)
    if (!handleResult(res, false)) return
    successMessage('quiz ' + res.data.quiz.id + ' created')
    console.log('Created: ', res.data.quiz)
    setQuiz(initQuiz)
  }

  const validateForm = () => {
    if (currentTotalProportion != 100) {
      errorMessage('Please set domain proportion to 100%.')
      return false
    }
    if (!quiz.title || isEmptyValue(quiz.totalPoints)) {
      errorMessage('Please input total points.')
      return false
    }
    return true
  }

  const onReset = () => {
    setQuiz(initQuiz)
  }

  return (
    <div className='admin-newquiz-container'>
      <div className='init-quiz-container'>
        <div className='input-item'>
          <div className='label'>
            Quiz Title:
          </div>
          <div className='input-wrapper'>
            <Input
             placeholder='My Quiz'
             defaultValue={quiz.title}
             onInput={(e: any) => updateQuizInfo('title', e.target.value)}
            />
          </div>
        </div>
        <div className='input-item'>
          <div className='label'>
            Quiz Tag:
          </div>
          <div className='input-wrapper'>
            <Input
             placeholder='tag1'
             defaultValue={quiz.tag}
             onInput={(e: any) => updateQuizInfo('tag', e.target.value)}
            />
          </div>
        </div>
        <div className='input-item'>
          <div className='label'>
            Total Points:
          </div>
          <div className='input-wrapper'>
            <InputNumber
             min={1}
             max={1000}
             defaultValue={quiz.totalPoints}
             onChange={(e: number) => updateQuizInfo('totalPoints', e)}
            />
          </div>
        </div>
        <div className='input-item text-area'>
          <div className='label'>
            Quiz Description:
          </div>
          <div className='input-wrapper'>
            <TextArea
              className='text-area'
              placeholder='descriptions...'
              defaultValue={quiz.description}
              onInput={(e: any) => updateQuizInfo('description', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='add-domain-container'>
        <div className='section-divider'> Domain Count: {quiz.domains.length} &nbsp;&nbsp;&nbsp;
          Domain Proportion: &nbsp;
          <span className={currentTotalProportion == 100 ? 'ok' : 'error'}>
            { currentTotalProportion } %
            { currentTotalProportion == 100 ? '' : ' Please Adjust Proportion!'}
          </span>{}
        </div>
        <div className='domain-list'>
          {domainList}
        </div>
        <Button onClick={addNewDomain}> Add Domain </Button>
      </div>

      <div className='add-questions-container'>

      </div>

      <div className='submit-container'>
        <Popconfirm
          title='Are you sure to reset this quiz?'
          onConfirm={onReset}
          // onCancel={cancel}
          okText='Yes'
          cancelText='No'
        >
          <Button type='dashed'> Reset Quiz </Button>
        </Popconfirm>
        
        <Button type='primary' onClick={onSubmit}> Create Quiz </Button>
      </div>
    </div>
  )
}

export default AdminNewQuiz