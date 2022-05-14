const initialState = {
  username: '',
  id: 0,
  chatroomId: null,
}

const userReducer = (preState: any = initialState, action: any) => {
  const { type, data } = action
  switch (type) {
  case 'setUser':
    return data
  default:
    return preState
  }
}

export default userReducer