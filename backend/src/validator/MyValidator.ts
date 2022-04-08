import { isEmptyValue } from "../utils/tools"
import { isBetween, isNumeric } from "../utils/validate"

class MyValidator {

  #data: any
  #taskList: (() => boolean)[]
  #preventNext: Boolean = false
  #isValid: boolean = true

  stringIsDigit: RegExp = /^\d+$/ // check if the string consists of numbers

  constructor (data: any) {
    console.log(data)
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

  isArray () {
    const fn = () => Object.prototype.toString.call(this.#data) === '[object Array]'
    this.#taskList.push(fn)
    return this
  }

  isString () {
    const fn = () => Object.prototype.toString.call(this.#data) === '[object String]'
    this.#taskList.push(fn)
    return this
  }

  isNumber () {
    const fn = () => Object.prototype.toString.call(this.#data) === '[object Number]'
    this.#taskList.push(fn)
    return this
  }

  Between (leftBound: number, rightBound: number, withLeft: boolean = true, withRight: boolean = true) {
    const fn = () => isBetween(this.#data, leftBound, rightBound, withLeft, withRight)
    this.#taskList.push(fn)
    return this
  }

  // do all validation
  check () {
    while (this.#isValid && !this.#preventNext && this.#taskList.length > 0) {
      const fn = <() => boolean>this.#taskList.shift()
      this.#isValid = fn()
    }
    return this.#isValid
  }
}

export default MyValidator