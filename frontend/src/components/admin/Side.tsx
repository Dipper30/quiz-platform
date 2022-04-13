import { sideConfig } from '../../config/admin-side'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

type MenuItem = {
  title: string,
  path: string,
  index: number,
}

type SideProp = {
  updateBreadCrumb: (str: string | null) => void
}

const Side: React.FC<SideProp> = (props) => {

  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = useState(1)
  const location = useLocation()
  useEffect(() => {
    const s = location.pathname.split('/')
    const currentPage = s[s.length - 1]
    let currentConfig = sideConfig.find(page => page.path == currentPage)
    if (s.length >=2 && s[s.length - 2] == 'quiz' && /^\d+$/.test(s[s.length - 1])) {
      // quiz detail
      currentConfig = sideConfig.find(page => page.path == 'quiz')
      setSelectedIndex(currentConfig?.index || 2)
      props.updateBreadCrumb(`Quiz ${s[s.length - 1]}`)
    } else {
      setSelectedIndex(currentConfig?.index || 1)
      props.updateBreadCrumb(currentConfig ? currentConfig.title : (currentPage == 'admin' ? ' Home' : null))
    }
  }, [location])

  return (
    <div className='admin-side-container'>
      <div className='menu-list'>
        { sideConfig &&
          sideConfig.map((item: MenuItem) => {
            return (
              <div className={'menu-item' + `${selectedIndex == item.index ? ' selected' : ''}`} key={item.index} onClick={() => {
                setSelectedIndex(item.index)
                navigate(`${item.path || ''}`)
                props.updateBreadCrumb(item.title)
              }}>
                { item.title }
              </div>
            )
          })
        }
     
      </div>
    </div>
  )
}

export default Side