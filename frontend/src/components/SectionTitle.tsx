import './SectionTitle.less'

type SectionTitleProps = {
}

const SectionTitle: React.FC<SectionTitleProps> = (props) => {
  return (
    <div className='section-title-container'>
      { props.children }
    </div>
  )
}

export default SectionTitle