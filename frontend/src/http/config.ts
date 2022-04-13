import { Quiz } from '../vite-env'
import { http, get, post, uploadFiles } from './api'

export const login = (params: {username: string, password: string}) => {
  return post('/login', params)
}

export const loginByToken = () => {
  return post('/token')
}

export const initQuiz = (quiz: Quiz) => {
  return post('initQuiz', quiz)
}

export const getQuizzesInfo = () => {
  return get('quizzes')
}

export const getQuizById = (id: number) => {
  return get(`quiz/${id}`)
}

export const getQuestionsByPartId = (id: number) => {
  return get('questions', { pid: id })
}