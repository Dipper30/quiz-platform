import { InputNumber } from 'antd'
import { SeqType } from '../../../vite-env'

type SequenceProps = {
  seq: number,
  type: SeqType,
  setSequence: (seq: number) => void,
}

const Sequence: React.FC<SequenceProps> = (props) => {
  return (
    <div className="admin-sequence-container">
      {
        props.type == 'plain'
          ? <div className="seq">{`${ props.seq }. `}</div>
          : <InputNumber defaultValue={props.seq} min={1} max={1000} onChange={(v: number) => props.setSequence(v)} />
      }
    </div>
  )
}

export default Sequence