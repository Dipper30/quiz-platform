import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type ResultProps = {
  
}

const Result: React.FC<ResultProps> = (props) => {

  const location = useLocation()

  useEffect(() => {
    // const { quiz } = location.state
    // console.log(quiz)
    console.log(location.state)
  }, [])

  return (
    <div className='result-container'>

    </div>
  )
}

export default Result