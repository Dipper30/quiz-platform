/* eslint-disable react/display-name */
import { useParams } from 'react-router-dom'

export const withRouter = (WrappedComponent: any) => (props: any) => {
  // eslint-disable-next-line no-undef
  const params = useParams()
  return (
    <WrappedComponent {...props} params={params} />
  )
}