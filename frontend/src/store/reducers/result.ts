const initialState = {
  score: 90,
}

const resultReducer = (preState: any = initialState, action: any) => {
  const { type, data } = action
  switch (type) {
  case 'setResult':
    return data
  default:
    return preState
  }
}

export default resultReducer