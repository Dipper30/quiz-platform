import { errCode } from '../config'
import { ParameterException } from '../exception'
import MyValidator from '../validator/MyValidator'

const stringIsDigit: RegExp = /^\d+$/

export const isPositiveInteger = (n: any): Boolean => {
  return Boolean(n) && typeof n == 'number' && n > 0
}

/**
 * check if all the attributes in the object are IDs, which are positive integers
 * @param {object} o 
 * @param {string[]} attrs 
 * @returns boolean
 */
export const attrsAreIDs = (o: any, attrs: string[]): Boolean => {
  if (typeof o != 'object') return false
  for (let a of attrs) {
    if (o.hasOwnProperty(a) && !isPositiveInteger(o[a])) return false
  }
  return true
}

/**
 * timestamp must be 13 digits number
 */
export const isTimeStamp = (ts: number): Boolean => {
  return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 13
}

/**
 * unix timestamp must be 10 digits number
 */
export const isUnixTimeStamp = (ts: number): Boolean => {
  return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 10
}

/**
 * check zip code, 5-digit long
 * @param code 
 * @returns 
 */
export const isZipCode = (code: any): Boolean => {
  return Boolean(code) && typeof code == 'number' && code.toString().length == 5
}

/**
 * check if the length of name is between [3, 15]
 * you can use function isBetween of course, but this is more convenient in particular cases
 */
export const isShortName = (p: any): Boolean => {
  return isBetween(p, 3, 15)
}

// export const stringIsNumeric = (s: string): Boolean => {
//   return stringIsDigit.test(s)
// }

export const stringIsBoolean = (s: string): Boolean => {
  return s == 'false' || s == 'true'
}

/**
 * return a ParameterException and define its message
 * @param msg 
 * @returns {ParameterException}
 */
export const createError = (msg: string = 'Parameter Error'): ParameterException => {
  return new ParameterException(errCode.PARAMETER_ERROR, msg)
}

/**
 * check if the string is numeric
 */
export const isNumeric = (data: any) => {
  return stringIsDigit.test(data)
}

/**
 * check if the number is between min and max
 * or check if the length of string is between min and max
 */
export const isBetween = (data: any, leftBound: number, rightBound: number, withLeft: boolean = true, withRight: boolean = true) => {
  try {
    if (typeof data === 'string') {
      return (withLeft ? Number(data) >= leftBound : Number(data) > leftBound)
        && (withRight ? Number(data) <= rightBound : Number(data) > rightBound)
    } else if (typeof data === 'number') {
      return (withLeft ? data >= leftBound : data > leftBound)
        && (withRight ? data <= rightBound : data > rightBound)
    } else return false
  } catch (error) {
    return false
  }
}

export const Validate = (data: any) => new MyValidator(data)