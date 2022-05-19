import { useEffect, useRef } from 'react'
import './ProgressBar.less'

type ProgressBarProps = {
  ratio: number, // 0 ~ 1
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {

  const progress = useRef<any>(null)
  const bar = useRef<any>(null)
  useEffect(() => {
    const totalWidth = progress.current?.clientWidth
    console.log('ratio ', props.ratio)
    const w = Math.floor(props.ratio * totalWidth) + 'px'
    bar.current.style.width = w
  }, [props.ratio])

  return (
    <div ref={progress} className='progress-bar-container'>
      <div ref={bar} className='current-progress' />
    </div>
  )
}

export default ProgressBar