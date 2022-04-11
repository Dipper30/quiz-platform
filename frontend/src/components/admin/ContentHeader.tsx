type ContentHeaderProps = {
  breadcrumb: string | null
}

const ContentHeader: React.FC<ContentHeaderProps> = (props) => {
  return (
    <>
      {
        props.breadcrumb ?
          (
            <div className="admin-content-header-container">
              { `Admin / ` } <span style={{color: '#1890ff'}}>{ `${props.breadcrumb}` }</span>
            </div>
          )
        : <div></div>
      }
    </>
    
    
  )
}

export default ContentHeader