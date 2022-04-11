import { Button } from 'antd'
import { useEffect } from 'react'
import { successMessage } from '../utils'

const Home: React.FC<any> = (props: any) => {

  useEffect(() => {
    successMessage('??')
  }, [])

  return (
    <>
      <h1>hello home</h1>
      <Button type="primary">按钮</Button>
    </>
  )
}

export default Home