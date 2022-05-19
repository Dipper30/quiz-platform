import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import './Result.less'

type ResultProps = {
  
}

const Result: React.FC<ResultProps> = (props) => {

  const result = useSelector((state: any) => state.result) 
  const navigate = useNavigate()

  useEffect(() => {
    // const { quiz } = location.state
    if (!result) navigate('/')
  }, [])

  return (
    <div className='result-container'>
      <div className='gap' />
      <p className='bold-text'> Congratulations! You Made it! </p>
      <p className='text'> Your Overall OGD Literacy Score is </p>
      <div className='score'> { result.score || 0 } </div>
      <span className='divider'></span>
      <p className='text'> Your Score in Each Pivot </p>
      <span className='divider'></span>
      <p className='text'> Relevant resources that might be helpful</p>
      <span className='divider'></span>
      <p className='bold-text'> Thank You! </p>
    </div>
  )
}

export default Result