import { Question, Quiz } from '../vite-env'
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

export const deleteQuiz = (id: number) => {
  return post('deleteQuiz', { qid: id })
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

export const createQuestion = (question: Question) => {
  return post('question', {
    isMulti: question.isMulti,
    description: question.description,
    partId: question.partId,
    choices: question.choices,
  })
}