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

// requests from users: hiding attributes such as 'score'
router.get('/questions', QuizController.getQuestions)
router.get('/quizzes', QuizController.getQuizzes)
router.post('/submit', QuizValidator.checkSubmission, QuizController.submitQuiz)
router.get('/score', QuizController.getScore)

// requests from admin: show detailed attribute
router.get('/allQuizzes', QuizController.getAllQuizzes)
router.get('/quiz/:id', QuizValidator.checkGetQuiz, QuizController.getQuizById)
router.get('/questionsWithScore', TokenValidator.verifyToken, QuizController.getQuestionsWithScore)
router.get('/records/:id', QuizController.getCSVFileOfScoreRecords) // get csv file
router.get('/detailedRecords/:id', QuizController.getCSVFileOfDetailedScoreRecords) // get csv file
router.get('/history/:id', TokenValidator.verifyToken, QuizController.getHistory) // get history by id

// update quiz
router.post('/initQuiz', QuizValidator.checkInitQuiz, TokenValidator.verifyToken, QuizController.initQuiz)
router.post('/toggleVisibility', QuizValidator.checkVisibility, TokenValidator.verifyToken, QuizController.toggleVisibilityOfQuiz)
router.post('/deleteQuiz', QuizValidator.checkDeleteQuiz, TokenValidator.verifyToken, QuizController.deleteQuiz)
router.post('/question', TokenValidator.verifyToken, QuizController.createOrUpdateQuestion)
router.post('/deleteQuestion', TokenValidator.verifyToken, QuizController.deleteQuestion)
router.post('/choice', TokenValidator.verifyToken, QuizController.createOrUpdateChoice)
router.post('/deleteChoice', TokenValidator.verifyToken, QuizController.deleteChoice)
router.post('/image', TokenValidator.verifyToken, QuizController.uploadImage)
router.get('/image', QuizController.getImage)

module.exports = router