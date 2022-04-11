import { useEffect, useMemo, useState } from "react"
import { Input, InputNumber, Button } from 'antd'
import './NewQuiz.less'
import { deepClone } from "../../utils"
import { Domain, Quiz } from "../../vite-env"
import DomainItem from "./form/DomainItem"

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

  const updateQuizInfo = (e: any, key: string) => {
    const input = typeof e == 'number' ? e : e.target?.value || ''
    quiz[key] = input
    setQuiz(quiz)
  }

  const pushDomain = () => {

  }

  const deleteDomain = (seq: number) => {
    quiz.domains.splice(seq - 1, 1)
    for (let index = seq - 1; index < quiz.domains.length; index++) {
      quiz.domains[index].seq--
    }
    const newQuiz = deepClone(quiz)
    setQuiz(newQuiz)
  }

  const addNewDomain = () => {
    const domain = {
      domainName: 'new domain',
      proportion: Math.max(100 - currentTotalProportion, 0),
      seq: quiz.domains.length + 1,
      id: domainId,
      parts: [],
    }
    setDomainId(domainId+1)
    quiz.domains = [...quiz.domains, domain]
    setQuiz(deepClone(quiz))
  }

  const inputQuizTitle = (e: any) => {
    const title = e.target?.value || ''
    quiz.title = title
    setQuiz(deepClone(quiz))
  }

  const updateDomain = (domain: Domain, seq: number) => {
    quiz.domains[seq - 1] = domain
    const newQuiz = deepClone(quiz)
    setQuiz(newQuiz)
  }


  return (
    <div className="admin-newquiz-container">
      <div className="init-quiz-container">
        <div className="input-item">
          <div className="label">
            Quiz Title:
          </div>
          <div className="input-wrapper">
            <Input placeholder="My Quiz" defaultValue={quiz.title} onInput={(e) => updateQuizInfo(e, 'title')} />
          </div>
        </div>
        <div className="input-item">
          <div className="label">
            Quiz Tag:
          </div>
          <div className="input-wrapper">
            <Input placeholder="" defaultValue={quiz.tag} onInput={(e) => updateQuizInfo(e, 'tag')} />
          </div>
        </div>
        <div className="input-item">
          <div className="label">
            Total Points:
          </div>
          <div className="input-wrapper">
            <InputNumber min={1} max={1000} defaultValue={quiz.totalPoints} onChange={(e: any) => updateQuizInfo(e, 'totalPoints')} />
          </div>
        </div>
        <div className="input-item text-area">
          <div className="label">
            Quiz Description:
          </div>
          <div className="input-wrapper">
            <TextArea className="text-area" placeholder="descriptions..." defaultValue={quiz.description} onInput={(e) => updateQuizInfo(e, 'description')} />
          </div>
        </div>
      </div>
      <div className="add-domain-container">
        <div className="section-divider"> Domain Count: {quiz.domains.length} &nbsp;&nbsp;&nbsp;
          Domain Proportion: &nbsp;
          <span className={currentTotalProportion == 100 ? 'ok' : 'error'}>
            { currentTotalProportion } % { currentTotalProportion == 100 ? '' : ' Please Adjust Proportion!'}
          </span>{}
        </div>
        <div className="domain-list">
          {
            quiz.domains?.map((domain: Domain, index: number) => (
              <DomainItem key={domain.id} domain={domain} update={updateDomain} deleteDomain={deleteDomain} />
            ))
          }
        </div>
        <Button onClick={addNewDomain}> Add Domain </Button>
      </div>
      <div className="add-questions-container">

      </div>
    </div>
  )
}

export default AdminNewQuiz