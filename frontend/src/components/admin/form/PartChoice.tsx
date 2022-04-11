import { useState } from "react"
import { PartChoice as PartChoiceType, SeqType } from "../../../vite-env"
import Sequence from "./Sequence"
import { Input, Checkbox } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'

type PartChoiceProps = {
  choice: PartChoiceType,
  deleteChoice: (seq: number) => void,
  update: (c: PartChoiceType, seq: number) => void,
}

const PartChoice: React.FC<PartChoiceProps> = (props) => {
  const [seqType, setSeqType] = useState(('plain') as SeqType)

  const setSequence = () => {}

  const updateChoiceInfo = (key: string, value: any) => {
    const newChoice = props.choice
    switch (key) {
      case 'description':
        newChoice.description = value
        break
      case 'willShowSubQuestions':
        newChoice.willShowSubQuestions = value
        break
    }
    props.update(newChoice, props.choice.seq)
  }



  return (
    <div className="admin-partchoice-container">
      <Sequence type={seqType} seq={props.choice.seq} setSequence={setSequence} />
      <Input placeholder="choice descriptions here" defaultValue={props.choice.description} onInput={(e: any) => updateChoiceInfo('domainName', e.target.value)} />
      <Checkbox onChange={(e: any) => updateChoiceInfo('willShowSubQuestions', e.target.checked)}> Show Sub Questions </Checkbox>
      { props.choice.willShowSubQuestions }
      <MinusCircleOutlined className="delete-btn icon-btn" onClick={() => props.deleteChoice(props.choice.seq)} />
    </div>
  )
}

export default PartChoice