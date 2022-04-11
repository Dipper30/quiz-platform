type ContentHeaderProps = {
  breadcrumb: string
}

const ContentHeader: React.FC<ContentHeaderProps> = (props) => {
  return (
    <div className="admin-content-header-container">
      { 'Admin / ' + props.breadcrumb }
    </div>
  )
}

export default ContentHeader