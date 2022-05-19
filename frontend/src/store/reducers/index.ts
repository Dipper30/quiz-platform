import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './user'
import resultReducer from './result'

export default combineReducers({
  user: userReducer,
  result: resultReducer,
})