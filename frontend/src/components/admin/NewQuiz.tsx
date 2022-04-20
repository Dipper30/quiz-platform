import { useEffect, useMemo, useState } from 'react'
import { Input, InputNumber, Button, Popconfirm } from 'antd'
import './NewQuiz.less'
import { deepClone, errorMessage, handleResult, isEmptyValue, successMessage } from '../../utils'
import { APIResponse, Domain, Quiz, Section } from '../../vite-env'
import DomainItem from './form/DomainItem'
import SectionItem from './form/SectionItem'
import api from '../../http'

const { TextArea } = Input

type AdminNewQuizProps = {
  
}

const initQuiz: Quiz = {
  title: 'MyQuiz',
  tag: '',
  description: 'descriptions...',
  totalPoints: 100,
  sections: [],
}

const AdminNewQuiz: React.FC<AdminNewQuizProps> = (props) => {

  const [quiz, setQuiz] = useState(deepClone(initQuiz))
  const[sectionStr, setSectionStr] = useState<string>('')

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
      // case 'domains':
      //   // eslint-disable-next-line no-case-declarations
      //   const { domain } = value
      //   quiz.domains[seq - 1] = domain
      //   break
      case 'section': // update single section
        const { section, seq } = value
        // const { seq } = value
        quiz.sections[seq] = section
        break
      case 'sections': // update sections according to input
        console.log(sectionStr)
        const sections = sectionStr.split(',').map((sectionName: string) => ({ title: sectionName, domains: [] }))
        quiz.sections = sections
        break
    }
    setQuiz(deepClone(quiz))
  }

  // const initSections = (e) => {

  // }

  const deleteDomain = (seq: number) => {
    if (seq == undefined) return
    quiz.domains.splice(seq - 1, 1)
    for (let index = seq - 1; index < quiz.domains.length; index++) {
      quiz.domains[index].seq--
    }
    setQuiz(deepClone(quiz))
  }

  const onSubmit = async () => {
    if (!validateForm()) return
    const res: APIResponse = await api.initQuiz(quiz)
    if (!handleResult(res, false)) return
    successMessage('quiz ' + res.data.quiz.id + ' created')
    setQuiz(deepClone(initQuiz))
  }

  const calculateTotalProportion = (domains: Domain[]) => {
    return domains.reduce((pre, cur) => pre + cur.proportion, 0)
  }

  const validateForm = () => {
    for (const section of quiz.sections) {
      if (calculateTotalProportion(section.domains) != 100) {
        errorMessage('Please set domain proportion to 100%.')
        return false
      }
    }
    if (!quiz.title || isEmptyValue(quiz.totalPoints)) {
      errorMessage('Please input total points.')
      return false
    }
    return true
  }

  const onReset = () => {
    setQuiz(deepClone(initQuiz))
  }

  const sectionList = quiz.sections?.map((section: Section, index: number) => (
    <SectionItem
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      seq={index}
      section={section}
      update={(section: Section, seq: number) => updateQuizInfo('section', { section, seq })}
    />
  ))

  const domainList = quiz.domains?.map((domain: Domain, index: number) => (
    <DomainItem
      key={domain.id}
      domain={domain}
      update={(domain: Domain, seq: number) => updateQuizInfo('domains', { domain, seq })}
      deleteDomain={deleteDomain}
    />
  ))

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
        <div className='input-item text-area'>
          <div className='label'>
            Quiz Sections:
          </div>
          <div className='input-wrapper'>
            <TextArea
              className='text-area'
              placeholder='section1, section2, section3...'
              value={sectionStr}
              onInput={(e: any) => setSectionStr(e.target.value)}
            />
          </div>
          <Button onClick={() => updateQuizInfo('sections', null)}> Confirm </Button>
        </div>
      </div>
      <div className='section-list'>
        { sectionList }
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