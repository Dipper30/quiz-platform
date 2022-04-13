import { useState } from 'react'
import { SeqType, Recommendation as RecommendationType } from '../../../vite-env'
import { Input, InputNumber, Checkbox } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'

type RecommendationProps = {
  recommendation: RecommendationType,
  id: number,
  deleteRecommendation: (id: number) => void,
  update: (c: RecommendationType, seq: number) => void,
}

const Recommendation: React.FC<RecommendationProps> = (props) => {
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const updateRecommendationInfo = (key: string, value: any) => {
    const recommendation = props.recommendation
    switch (key) {
      case 'link':
        recommendation.link = value
        break
      case 'showUnder':
        recommendation.showUnder = value
        break
    }
    props.update(recommendation, props.id)
  }

  return (
    <div className='admin-partchoice-container'>
      <Input placeholder='paste links here' defaultValue={props.recommendation.link} onInput={(e: any) => updateRecommendationInfo('domainName', e.target.value)} />
      <InputNumber placeholder='Show link if under...' defaultValue={props.recommendation.show_under || 25} onChange={(e: number) => updateRecommendationInfo('domainName', e)} />
      <MinusCircleOutlined className='delete-btn icon-btn' onClick={() => props.deleteRecommendation(props.id)} />
    </div>
  )
}

export default Recommendation