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

/**
 * get quizzes abstracts including invisible ones
 */
export const getAllQuizzesInfo = () => {
  return get('allQuizzes')
}

/**
 * toggle quiz visibility
 * @param qid
 */
export const toggleVisibility = (qid: number) => {
  return post('toggleVisibility', { qid })
}

export const getQuizById = (id: number) => {
  return get(`quiz/${id}`)
}

export const getQuestionsByPartId = (pid: number, pcid: number = 0, withScore: boolean = false) => {
  return withScore ? get('questionsWithScore', { pid, pcid }) : get('questions', { pid, pcid })
}

export const deleteQuestionById = (pid: number) => {
  return post('deleteQuestion', { id: pid })
}

export const createQuestion = (question: Question) => {
  return post('question', {
    isMulti: question.isMulti,
    description: question.description,
    partChoices: question.partChoices,
    choices: question.choices,
    partId: question.partId,
  })
}

export const getRecords = (qid: number) => {
  return get(`records/${qid}`)
}