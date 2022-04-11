import ContentHeader from "./ContentHeader"

type ContentProps = {
  breadcrumb: string
}

const Content: React.FC<ContentProps> = (props) => {
  return (
    <div className="admin-content-container">
      <ContentHeader breadcrumb={props.breadcrumb} />
      { props.children }
    </div>
  )
}

export default Content