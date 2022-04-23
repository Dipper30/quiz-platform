import { useState } from 'react'
import { choiceSeq } from '../config/choices'
import { Checkbox } from 'antd'

type QuizPartProps = {
  part: any,
  currentPartId: number,
  visible: boolean
}

const QuizPart: React.FC<QuizPartProps> = (props) => {

  const [selectedPartChoices, setSelectedPartChoices] = useState<number[]>([])

  const partChoices = props.part.choices?.map((choice: any, index: number) => (
    <div className={ `part-choice${!selectedPartChoices.includes(choice.id) ? ' selected' : ''}` } key={choice.id}>
      {/* <Checkbox className='check-box' checked={ selectedPartChoices.includes(choice.id) } /> */}
      <div className='seq'>
        { choiceSeq[index + 1] }.
      </div>
      <div className='choice-description'>
        { choice.description }
      </div>
    </div>
  )) || <div></div>

  return (
    <>
      {
        props.visible ?
          <div className='part-container'>
            <div className='part-description'>
              In this part, you will be focusing on <span> {props.part.name} </span>
            </div>
            <div className='part-choices'>
              { partChoices }
            </div>
          </div>
        : <></>
      }
    </>

  )
}

export default QuizPart