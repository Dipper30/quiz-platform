import { useState } from "react"
import Content from "./Content"
import Header from "./Header"
import Side from "./Side"

type LayoutProps = {
  children: any,
}

const Layout: React.FC<LayoutProps> = (props) => {

  const [breadcrumb, setBreadcrumb] = useState<string | null>('Home')



  return (
    <div className="admin-layout-container">
      <Header />
      <Side updateBreadCrumb={(str: string | null) => setBreadcrumb(str)} />
      <Content breadcrumb={breadcrumb}>{ props.children }</Content>
    </div>
  )
}

export default Layout