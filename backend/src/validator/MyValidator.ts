import { isArray, isString, isEmptyValue, isNumber, isBoolean } from '../utils/tools'
import { isBetween, isNumeric } from '../utils/validate'

class MyValidator {

  #data: any
  #taskList: (() => boolean)[]
  #preventNext: Boolean = false

  stringIsDigit: RegExp = /^\d+$/ // check if the string consists of numbers
  #isValid: boolean = true

  constructor (data: any) {
    this.#data = data
    this.#taskList = []
    if (isEmptyValue(data)) this.#preventNext = true
    // return this
  }

  allowEmpty () {
    this.#preventNext = false
    return this
  }

  /**
   * check if the string is numeric
   * @returns 
   */
  Numeric () {
    const fn = () => isNumeric(this.#data)
    this.#taskList.push(fn)
    return this
  }

  Array () {
    const fn = () => isArray(this.#data)
    this.#taskList.push(fn)
    return this
  }

  String () {
    const fn = () => isString(this.#data)
    this.#taskList.push(fn)
    return this
  }

  Number () {
    const fn = () => isNumber(this.#data)
    this.#taskList.push(fn)
    return this
  }

  Boolean () {
    const fn = () => isBoolean(this.#data)
    this.#taskList.push(fn)
    return this
  }

  Between (leftBound: number, rightBound: number = Number.MAX_VALUE, withLeft: boolean = true, withRight: boolean = true) {
    const fn = () => isBetween(this.#data, leftBound, rightBound, withLeft, withRight)
    this.#taskList.push(fn)
    return this
  }

  // do all validation
  get isValid () {
    if (!this.#data) return false
    while (this.#isValid && !this.#preventNext && this.#taskList.length > 0) {
      const fn = <() => boolean>this.#taskList.shift()
      this.#isValid = fn()
    }
    return this.#isValid
  }

}

export default MyValidator