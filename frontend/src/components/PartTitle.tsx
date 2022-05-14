import './PartTitle.less'

type PartTitleProps = {
}

const SectionTitle: React.FC<PartTitleProps> = (props) => {
  return (
    <div className='part-title-container'>
      { props.children }
    </div>
  )
}

export default SectionTitle