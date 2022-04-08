import { AccountInfo } from '../types/User'

const jwt = require('jsonwebtoken')
import { keys } from '../config'
import { isEmptyValue } from '../utils/tools'

class Token {

  /**
   * generate token by user id and username
   * @param { userID: number, username: string } dataToEncript 
   * @returns String
   */
  generateToken (dataToEncript: { userID: number, username: string }): String {
    let token = jwt.sign({ ...dataToEncript }, keys.TOKEN_PRIVATE_KEY, { expiresIn: keys.TOKEN_EXPIRE_IN })
    return token
  }

  verifyToken (token: String | Number | undefined, requiredAuth?: Number): Boolean {
    if (isEmptyValue(token)) return false
    try {
      const res: { userID: Number, auth: Number[], iat: Number, exp: Number } = jwt.verify(token, keys.TOKEN_PRIVATE_KEY) || {}
      const { userID, auth, iat, exp = 0 } = res
      const current = Math.floor(Date.now() / 1000)
      // if current timestamp is larger than the expire time, return false
      if (current > exp) return false
      if (requiredAuth && !auth.includes(requiredAuth)) return false
      return true
    } catch (error) {
      return false
    }
  }

  veryTokenWithID (token: String | Number | undefined, requiredAuth?: Number): Number {
    if (isEmptyValue(token)) return 0
    try {
      const res: { userID: Number, auth: Number[], iat: Number, exp: Number } = jwt.verify(token, keys.TOKEN_PRIVATE_KEY) || {}
      const { userID, auth, iat, exp = 0 } = res
      const current = Math.floor(Date.now() / 1000)
      // if current timestamp is larger than the expire time, return false
      if (current > exp) return 0
      if (requiredAuth && !auth.includes(requiredAuth)) return 0
      return userID
    } catch (error) {
      return 0
    }
  }
}

export default new Token()