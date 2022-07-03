/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'
import './Login.less'
import api from '../http'
import { setUser } from '../store/actions/user'
// import { userReducer } from '../store/reducers'
import { connect } from 'react-redux'
import { handleResult, setLocalStorage } from '../utils' 
import { useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd'

const Login: React.FC = (props: any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [lock, setLock] = useState(false)
  const navigate = useNavigate()

  let timer: any = null

  const login = async () => {
    if (lock) return
    setLock(true)
    // timeout after 1500ms
    timer = setTimeout(() => {
      setLock(false)
      clearTimeout(timer)
    }, 1500)
    const p = {
      username,
      password,
    }
    const res: any = await api.login(p)
    setLock(false)
    clearTimeout(timer)
    if (handleResult(res)) {
      const { data } = res
      props.setUser(data.user)
      setLocalStorage('token', data.token)
      setLocalStorage('uid', data.user.id)
      navigate('/admin')
    }
  }

  const handleEnterKeyDown = (e: any): void => {
    if (e.code == 'Enter' && !lock) {
      login()
    }
  }

  // useEffect(() => {
  //   document.addEventListener('keydown', handleEnterKeyDown)
  //   return () => document.removeEventListener('keydown', handleEnterKeyDown)
  // }, [])

  return (
    <>
      <div className='login-container'>
        <div className='title'>Login</div>
        <div className='row'>
          <div className='label'>Username</div>
          <input autoFocus onKeyDown={handleEnterKeyDown} placeholder='Type username...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          <span className='count'>{username.length} / 12</span>
        </div>
        <div className='row'>
          <div className='label'>Password</div>
          <input onKeyDown={handleEnterKeyDown} type={'password'} placeholder='Type password...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          <span className='count'>{password.length} / 12</span>
        </div>
        <Button onClick={login}> Sign In </Button>
      </div>
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
)(Login)
