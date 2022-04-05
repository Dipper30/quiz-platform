const express = require('express')
const router = require('./router/index.ts')
require('dotenv').config()

const app = express()

app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))

app.all('*', async (req: any, res: any, next: any) => {
  const { origin, Origin, referer, Referer } = req.headers
  const allowOrigin = origin || Origin || referer || Referer || '*'
  // console.log('get', allowOrigin)
  res.header('Access-Control-Allow-Origin', allowOrigin)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, token') // with token
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) // with cookies
  res.header('X-Powered-By', 'Express')

  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

router(app)

// catch exception and log out error message
app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    let status = err.code ? 200 : 500
    res.status(status).json({
      code: err.code || 500,
      msg: err.message || 'Bad Request',
    })
  }
})

app.listen(3000, () => {
  console.log('ok ', process.env.USERNAME)
})
