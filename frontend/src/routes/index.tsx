import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import Home from '../pages/Home'
import AdminHome from '../components/admin/Home'
import AdminNewQuiz from '../components/admin/NewQuiz'
import AdminQuiz from '../components/admin/Quiz'
import AdminQuizDetail from '../components/admin/QuizDetail'
import NotFound from '../pages/404'
import Quiz from '../pages/Quiz'
import Result from '../pages/Result'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<Admin />}>
          <Route path='' element={<AdminHome />} />
          <Route path='home' element={<AdminHome />} />
          <Route path='quiz/:id' element={<AdminQuizDetail />} />
          <Route path='quiz' element={<AdminQuiz />} />
          <Route path='new' element={<AdminNewQuiz />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='/quiz/:id' element={<Quiz />} />
        <Route path='/result' element={<Result />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
