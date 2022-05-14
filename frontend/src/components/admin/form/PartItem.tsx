import Sequence from './Sequence'
import { Input, Button } from 'antd'
import { useState } from 'react'
import PartChoice from './PartChoice'
import { PlusCircleOutlined } from '@ant-design/icons'
import Recommendation from './Recommendation'

type PartItemProps = {
  part: PartType,
  seqType: SeqType,
  deletePart: (seq: number) => void,
  update: (part: PartType, seq: number) => void,
}

const PartItem: React.FC<PartItemProps> = (props) => {

  const [choiceId, setChoiceId] = useState(Date.now())
  const [recommendationId, setRecommendationId] = useState(Date.now())
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const setSequence = (seq: number) => {} //TODO should support editing sequence

  const updatePartInfo = (key: string, value: any) => {
    const newPart = props.part
    switch (key) {
      case 'partName':
        newPart.partName = value
        break
      case 'choices':
        const { choice, seq } = value
        newPart.choices = newPart.choices.map((c: any) => c.seq == seq ? choice : c)
        break
      case 'recommendations':
        const { recommendation, id } = value
        newPart.recommendations = newPart.recommendations.map((r: any) => r.id == id ? recommendation : r)
    }
    props.update(newPart, props.part.seq)
  }

  const addNewChoice = () => {
    const choice: PartChoiceType = {
      description: 'new choice',
      willShowSubQuestions: false,
      seq: props.part.choices.length + 1,
      id: choiceId,
    }
    setChoiceId(choiceId + 1)
    props.part.choices.push(choice)
    props.update(props.part, props.part.seq)
  }

  const deleteChoice = (seq: number) => {
    const { choices } = props.part
    choices.splice(seq - 1, 1)
    for (let index = seq - 1; index < choices.length; index++) {
      choices[index].seq--
    }
    props.update(props.part, props.part.seq)
  }

  const addNewRecommendation = () => {
    const recommendation: RecommendationType = {
      link: 'https://www.google.com',
      showUnder: 25,
      id: recommendationId,
    }
    setRecommendationId(recommendationId + 1)
    props.part.recommendations.push(recommendation)
    props.update(props.part, props.part.seq)
  }

  const deleteRecommendation = (id: number) => {
    props.part.recommendations = props.part.recommendations.filter(r => r.id != id)
    props.update(props.part, props.part.seq)
  }

  const partchoiceList = props.part.choices.map((choice) => (
    <PartChoice
      key={choice.id}
      choice={choice}
      update={(choice, seq) => updatePartInfo('choices', { choice, seq })}
      deleteChoice={deleteChoice}
    />
  ))

  const recommendationList = props.part.recommendations.map((recommendation) => (
    <Recommendation
      key={recommendation.id}
      id={recommendation.id || recommendationId}
      recommendation={recommendation}
      update={(recommendation, id) => updatePartInfo('recommendations', { recommendation, id })}
      deleteRecommendation={deleteRecommendation} />
  ))

  return (
    <div className='admin-part-container'>
      <Sequence seq={props.part.seq} type={props.seqType} setSequence={setSequence} />
      <div className='part-content'>
        <div className='input-item'>
          <div className='label'>
            Part Name:
          </div>
          <div className='input-wrapper'>
            <Input defaultValue={props.part.partName} onInput={(e: any) => updatePartInfo('partName', e.target.value)} />
          </div>
          <Button className='delete-btn' danger onClick={() => props.deletePart(props.part.seq)}> Delete </Button>
        </div>
        <div className='section-divider'>
          Choices: {` ${props.part.choices.length}`}
          <PlusCircleOutlined className='icon-btn add-btn' onClick={addNewChoice} />
        </div>
        { partchoiceList }
        <div className='section-divider'>
          Recommendations: {` ${props.part.recommendations.length}`}
          <PlusCircleOutlined className='icon-btn add-btn' onClick={addNewRecommendation} />
        </div>
        { recommendationList }
      </div>
      
    </div>
  )
}

export default PartItem