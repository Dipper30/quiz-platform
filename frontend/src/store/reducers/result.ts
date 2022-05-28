const initialState: {
  loading: boolean,
  data: any,
} = {
  loading: false,
  data: null,
}
const resultReducer = (preState: any = initialState, action: any) => {
  const { type, data } = action
  switch (type) {
  case 'setResult':
    return { ...preState, data }
  case 'setLoading':
    return { ...preState, loading: data }
  default:
    return preState
  }
}

export default resultReducer