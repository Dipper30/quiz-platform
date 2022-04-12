import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type QuizDetailProps = {
  
}

const QuizDetail: React.FC<QuizDetailProps> = (props) => {

  const { id } = useParams()
  
  useEffect(() => {
    
    console.log(id)
  }, [])

  return (
    <div className='admin-quiz-detail-container'>
      QuizDetail
    </div>
  )
}

export default QuizDetail