import React, { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const Login = lazy(() => import('../pages/Login'))
const Admin = lazy(() => import('../pages/Admin'))
const Home = lazy(() => import('../pages/Home'))
const AdminHome = lazy(() => import('../components/admin/Home'))
const AdminNewQuiz = lazy(() => import('../components/admin/NewQuiz'))
const AdminQuiz = lazy(() => import('../components/admin/Quiz'))
const AdminQuizDetail = lazy(() => import('../components/admin/QuizDetail'))
const NotFound = lazy(() => import('../pages/404'))
const Quiz = lazy(() => import('../pages/Quiz'))
const Result = lazy(() => import('../pages/Result'))

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<React.Suspense fallback={<></>}> <Home /> </React.Suspense>} />
        <Route path='/login' element={<React.Suspense fallback={<></>}> <Login /> </React.Suspense>} />
        <Route path='/admin' element={<React.Suspense fallback={<></>}> <Admin /> </React.Suspense>}>
          <Route path='' element={<React.Suspense fallback={<></>}> <AdminHome /> </React.Suspense>} />
          <Route path='home' element={<React.Suspense fallback={<></>}> <AdminHome /> </React.Suspense>} />
          <Route path='quiz/:id' element={<React.Suspense fallback={<></>}> <AdminQuizDetail /> </React.Suspense>} />
          <Route path='quiz' element={<React.Suspense fallback={<></>}> <AdminQuiz /> </React.Suspense>} />
          <Route path='new' element={<React.Suspense fallback={<></>}> <AdminNewQuiz /> </React.Suspense>} />
          <Route path='*' element={<React.Suspense fallback={<></>}> <NotFound /> </React.Suspense>} />
        </Route>
        <Route path='/quiz/:id' element={<React.Suspense fallback={<></>}> <Quiz /> </React.Suspense>} />
        <Route path='/result' element={<React.Suspense fallback={<>Calculating...</>}> <Result /> </React.Suspense>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
