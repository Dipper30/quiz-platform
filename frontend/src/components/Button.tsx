import './Button.less'

type ButtonStyle = 'left' | 'right'

type ButtonProps = {
  children: any,
  style: ButtonStyle,
  loading?: boolean,
  onClick?: () => void,
}

const Button: React.FC<ButtonProps> = (props) => {

  return (
    <div
      className={ `button-container${props.style === 'left' ? ' left' : ' right'}${props.loading === true ? ' loading': ''}` }
      onClick={() => !props.loading && props.onClick && props.onClick()}  
    >
      {
        props.style === 'left' ?
        <div className='left-arrow'></div> : ''
      }
      <div className='text'>
        { props.children }
      </div>
      {
        props.style === 'right' ?
        <div className='right-arrow'></div> : ''
      }
    </div>
  )
}

export default Button