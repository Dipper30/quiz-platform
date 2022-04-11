import { keys } from '../config'
import { getUnixTS, isEmptyValue } from '../utils/tools'
const jwt = require('jsonwebtoken')
class Token {
  /**
   * generate token by user id and username
   * @param { username: string } dataToEncript 
   * @returns String
   */
  generateToken (dataToEncript: { username?: string }): String {
    let token = jwt.sign({ ...dataToEncript }, keys.TOKEN_PRIVATE_KEY, { expiresIn: keys.TOKEN_EXPIRE_IN })
    return token
  }

  verifyToken (token: String | Number | undefined): Boolean {
    if (isEmptyValue(token)) return false
    try {
      const res: { auth: Number[], iat: Number, exp: Number } = jwt.verify(token, keys.TOKEN_PRIVATE_KEY) || {}
      const { exp = 0 } = res
      const current = getUnixTS()
      // if current timestamp is larger than the expire time, return false
      if (current > exp) return false
      return true
    } catch (error) {
      return false
    }
  }

}

export default new Token()