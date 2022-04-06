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




module.exports = router