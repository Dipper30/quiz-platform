import { useEffect, useState } from "react"
import { errorMessage, getLocalStorage, getUser, isError, setLocalStorage } from "../utils"
import { BrowserRouter, Routes, Route, Outlet, useParams, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { loginByToken } from "../http/config"
import { connect } from 'react-redux'
import { setUser } from "../store/actions/user"
import Layout from "../components/admin/Layout"
const Admin: React.FC<any> = (props: any) => {

  const navigate = useNavigate()  

  useEffect(() => {
    const user = getUser()
    if (!user || !user?.id) {
      const token = getLocalStorage('token')
      if (!token) {
        navigate('/login')
      } else {
        loginByToken().then((res: any) => {
          if (isError(res)) throw new Error('Invalid Token')
          const { data } = res
          setUser(data.user)
          console.log('token login: ', data)
          setLocalStorage('token', data.token)
          setLocalStorage('uid', data.user.id)
        }).catch((err: any) => {
          errorMessage('Please Log In.')
          navigate('/login')
        })
      }
    } else {
      setUser(user)
    }
  }, [])

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}

export default connect(
  (state: any) => ({
    user: state.user,
  }),
  {
    setUser,
  },
)(Admin)
