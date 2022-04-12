import { useState } from 'react'
import { SeqType, Recommendation as RecommendationType } from '../../../vite-env'
import { Input, Checkbox } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'

type RecommendationProps = {
  recommendation: RecommendationType,
  id: number,
  deleteRecommendation: (id: number) => void,
  update: (c: RecommendationType, seq: number) => void,
}

const Recommendation: React.FC<RecommendationProps> = (props) => {
  
  const [seqType, setSeqType] = useState(('plain') as SeqType)
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const updateRecommendationInfo = (key: string, value: any) => { }

  return (
    <div className='admin-partchoice-container'>
      <Input placeholder='paste links here' defaultValue={props.recommendation.link} onInput={(e: any) => updateRecommendationInfo('domainName', e.target.value)} />
      <MinusCircleOutlined className='delete-btn icon-btn' onClick={() => props.deleteRecommendation(props.id)} />
    </div>
  )
}

export default Recommendation