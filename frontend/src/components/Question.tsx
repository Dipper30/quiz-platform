/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react'
import { choiceSeq } from '../config/choices'
import { SubmissionChoice } from '../pages/Quiz'
import { deepClone } from '../utils'
import { Checkbox, Radio, Tag } from 'antd'
import './Question.less'

type QuestionProps = {
  question: QuestionType,
  seq: number,
  isSubQuestion: boolean,
  currentSelected?: number[],
  update: (choice: SubmissionChoice) => void
}

const Question: React.FC<QuestionProps> = (props) => {

  const [selectedPartChoices, setSelectedPartChoices] = useState<number[]>([])
  const [largeImgVisible, setLargeImgVisible] = useState<boolean>(false)
  const [currentImgSrc, setCurrentImgSrc] = useState<string>('')

  useEffect(() => {
    props.update({ qid: Number(props.question.id), cid: selectedPartChoices })
  }, [selectedPartChoices])

  const toggleSelected = (id: number) => {
    let hasRecord = false
    for (let i = 0; i < selectedPartChoices.length; i++) {
      if (selectedPartChoices[i] === id) {
        selectedPartChoices.splice(i, 1)
        hasRecord = true
        break
      }
    }

    if (props.question.is_multi) {
      if (!hasRecord) selectedPartChoices.push(id)
      setSelectedPartChoices(deepClone(selectedPartChoices))
    } else {
      hasRecord ? setSelectedPartChoices([]) : setSelectedPartChoices([id])
    }
  }
  
  const showFullImg = (src: string) => {
    setCurrentImgSrc(src)
    setLargeImgVisible(true)
  }

  return (
    <div className='question-container'>
      {
        (largeImgVisible && currentImgSrc) && (
        <div className='img-large' onClick={() => setLargeImgVisible(false)}>      
          <img src={currentImgSrc} alt='large-img' />
        </div>)
      }

      <div className='description'>
        { props.question?.description ||
          `In this part, we will focus on ${props.question.name}.`
        }
          { props.question.is_multi ? <Tag color='green'> You may select more than one choice. </Tag> : '' }
      </div>
      { props.question.imgList && (
        <div className='img-container'>
          { props.question.imgList.map((imgSrc: any, index) => (
            <img
              key={index}
              src={`data:image/${imgSrc.type};base64,${imgSrc.data}`}
              alt='img'
              onClick={() => showFullImg(`data:image/${imgSrc.type};base64,${imgSrc.data}`)}
            />
          )) }
        </div>
      ) }
      <div className='choice-list'>
        {
          props.question.choices.map((c: ChoiceType, index: number) => (
            <div key={c.id} className='choice-container'>
              { props.question.is_multi ?
                (<Checkbox
                  checked={props.isSubQuestion ? props.currentSelected?.includes(Number(c.id)) : selectedPartChoices.includes(Number(c.id))}
                  onClick={() => toggleSelected(Number(c.id))}
                />) :
                (<Radio
                  checked={props.isSubQuestion ? props.currentSelected?.includes(Number(c.id)) : selectedPartChoices.includes(Number(c.id))}
                  onClick={() => toggleSelected(Number(c.id))}
                />)
              }
              
              <div
                key={c.id}
                className='choice'
                onClick={() => toggleSelected(Number(c.id))}
              >
                { props.isSubQuestion ? `${choiceSeq[index + 1]}.  ` : '' }
                { c.description }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Question