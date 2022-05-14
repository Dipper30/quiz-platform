import api from '../../http'

export const setUser = (data: User) => ({ type: 'setUser', data })

// async function
export const loginAsync = (data: any) => {
  return async (dispatch: any) => {
    const res = await api.login(data)
    if (res.data) {
      dispatch(setUser(res.data.user))
    }
    return res.data
  }
}