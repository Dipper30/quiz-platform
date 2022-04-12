import { Router } from 'express'

import { 
  AuthController,
  QuizController,
} from '../controller'

import {
  AuthValidator, QuizValidator,
} from '../validator'
import TokenValidator from '../validator/TokenValidator'

const router: Router = Router()

// login
router.post('/login', AuthValidator.checkLogin, AuthController.login)
router.post('/token', TokenValidator.verifyToken, AuthController.loginByToken)

// update quiz
router.post('/initQuiz', QuizValidator.checkInitQuiz, TokenValidator.verifyToken, QuizController.initQuiz)
router.post('/question', QuizController.createOrUpdateQuestion)
router.post('/deleteQuestion', QuizController.deleteQuestion)
router.post('/choice', QuizController.createOrUpdateChoice)
router.post('/deleteChoice', QuizController.deleteChoice)

// requests from users: hiding attributes such as 'score'
router.get('/questions', QuizController.getQuestions)

// requests from admin: show detailed attribute
router.get('/quizzes', QuizController.getQuizzes)
router.get('/quiz/:id', QuizValidator.checkGetQuiz, QuizController.getQuizById)
router.get('/questions', QuizController.getQuestions)
router.get('/questionsDetail', QuizController.getQuestionsWithAuth)

module.exports = router