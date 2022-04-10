const validator = require('validator')

import MyValidator from './MyValidator'
import { Validator } from '../types/common'
import { queryIsNull } from '../utils/tools'
import { ParameterException } from '../exception'
import { errCode } from '../config'

class BaseValidator {

  params: any
  stringIsDigit: RegExp = /^\d+$/ // check if the string consists of numbers

  createError (msg: string = 'Parameter Error'): ParameterException {
    return new ParameterException(errCode.PARAMETER_ERROR, msg)
  }

  validate (data: any) {
    return new MyValidator(data)
  }

  isPositiveInteger (n: any): Boolean {
    return Boolean(n) && typeof n == 'number' && n > 0
  }

  /**
   * check if all the attributes in the object are IDs, which are positive integers
   * @param {object} o 
   * @param {string[]} attrs 
   * @returns boolean
   */
  attrsAreIDs (o: any, attrs: string[]): Boolean {
    if (typeof o != 'object') return false
    for (let a of attrs) {
      if (o.hasOwnProperty(a) && !this.isPositiveInteger(o[a])) return false
    }
    return true
  }

  // unix timestamp must be 13 digits
  isTimeStamp (ts: number): Boolean {
    return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 13
  }

  // unix timestamp must be 10 digits
  isUnixTimeStamp (ts: number): Boolean {
    return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 10
  }

  // check zip code, 5-digit long
  isZipCode (code: any): Boolean {
    return Boolean(code) && typeof code == 'number' && code.toString().length == 5
  }

  // check if the number is between min and max
  // or check if the length of string is between min and max
  isBetween (p: any, min: number, max: number): Boolean {
    return Boolean(p) 
    && (typeof p == 'number' && p >= min && p <= max)
    || (typeof p == 'string' && p.length >= min && p.length <=max)
  }

  // check if the length of name is between [3, 15]
  // you can use function isBetween of course, but this is more convenient in particular cases
  isShortName (p: any): Boolean {
    return this.isBetween(p, 3, 15)
  }

  isLongName (p: any): Boolean {
    return this.isBetween(p, 5, 30)
  }

  stringIsNumeric (s: string): Boolean {
    return this.stringIsDigit.test(s)
  }

  stringIsBoolean (s: string): Boolean {
    return s == 'false' || s == 'true'
  }

  // if the param does not include page, return true
  // else if the param 
  checkPager (p: any): Boolean {
    if (!p.hasOwnProperty('pager')) return true
    const { pager } = p
    if (pager.hasOwnProperty('page')) {
      if (!this.isPositiveInteger(pager.page)) return false
    } else if (!pager.hasOwnProperty('size')) {
      return false // no page and no size
    } else {
      return this.isPositiveInteger(pager.size)
    }
    return true
  }

  isPhone (phone: number): Boolean {
    const phoneExp = /^[0-9]{10}/
    return phoneExp.test(phone.toString())
  }

  isEmail (email: string): Boolean {
    const emailExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
    return emailExp.test(email)

  }

}

export default BaseValidator