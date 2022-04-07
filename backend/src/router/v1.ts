import { Router } from 'express'

import { 
  AuthController,
  QuizController,
} from '../controller'

import {
  AuthValidator,
} from '../validator'

const router: Router = Router()

// login
router.post('/login', AuthValidator.checkLogin, AuthController.login)

// quiz
router.post('/initQuiz', QuizController.initQuiz)
router.post('/question', QuizController.createOrUpdateQuestion)
router.post('/deleteQuestion', QuizController.deleteQuestion)
router.post('/choice', QuizController.createOrUpdateChoice)
router.post('/deleteChoice', QuizController.deleteChoice)

module.exports = router