import { useEffect, useState } from 'react'
import Question from './Question'
import MyButton from './Button'
import './QuestionList.less'
import ProgressBar from './ProgressBar'
import { SubmissionChoice } from '@/pages/Quiz'

type QuestionListProps = {
  questions: QuestionType[],
  updateQuestion: (choice: SubmissionChoice) => void,
  submitQuestions: () => void,
}

const QuestionList: React.FC<QuestionListProps> = (props) => {

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [currentSelected, setCurrentSelected] = useState<number[]>([])
  const [selectedChoices, setSelectedChoices] = useState<Map<number, number[]>>(new Map())

  const updateQuestion = (choice: SubmissionChoice) => {
    //
    const { qid, cid } = choice
    selectedChoices.set(qid, cid)
    resize(qid)
    props.updateQuestion(choice)
  }

  const submitQuestions = () => {
    //
  }

  const resize = (index: number = 0) => {
    console.log('resize ', index, selectedChoices, selectedChoices.get(index))
    setCurrentSelected(selectedChoices.get(index) || [])
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      resize(props.questions[currentIndex - 1]?.id || 0)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < props.questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      resize(props.questions[currentIndex + 1]?.id || 0)
    }
  }

  return (
    <div className='question-list-container'>
      {/* <div className='question-view-port'>
        <div className='questions'>
          {
            props.questions?.map(question => (
              <Question
                key={question.id}
                isSubQuestion={true}
                question={props.questions[currentIndex]}
                seq={currentIndex + 1}
                update={props.updateQuestion}
              />
            ))
          }
        </div>
      </div> */}

      <Question
        isSubQuestion={true}
        question={props.questions[currentIndex]}
        seq={currentIndex + 1}
        update={updateQuestion}
        currentSelected={currentSelected}
      />

      {
        props.questions?.length && (
          <>
            <br />
            <ProgressBar ratio={(currentIndex + 1) / props.questions?.length} />
            <div> { `Q${currentIndex + 1} / ${props.questions.length}` } </div>
            <br />
          </>
        )
      
      }
      <br />
      <div className='buttons'>
        { currentIndex !== 0 ? <MyButton style='left' onClick={prevQuestion}> BACK </MyButton> : <div /> }
        { currentIndex !== props.questions?.length - 1
          ? <MyButton style='right' onClick={nextQuestion}> NEXT </MyButton>
          : <MyButton style='right' onClick={props.submitQuestions}> NEXT SECTION </MyButton> }
      </div>
      { currentIndex === props.questions?.length - 1 &&
        <>
          <br />
          <span> { 'Note: this question is the  last question in this section. After clicking "Next Section", you can\'t go back to this section. ' } </span>
        </>
      }  
    </div>
  )
}

export default QuestionList