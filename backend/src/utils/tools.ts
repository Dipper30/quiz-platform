import BaseException from '../exception/BaseException'
import moment from 'moment'

const crypto = require('crypto')
import { keys } from '../config'

const attrs: string[] = [
  'createdAt',
  'updatedAt',
]

export const isObject = (obj: any): Boolean => Object.prototype.toString.call(obj) == '[object Object]'

export const isArray = (arr: any): Boolean => Object.prototype.toString.call(arr) == '[object Array]'


/**
 * check if the element is contained in Enum's value
 * @param {any} enumType Enum
 * @param {any} el element to check
 * @returns {Boolean}
 */
export const enumIncludes = (enumType: any, el: any): Boolean => Object.values(enumType).includes(el)

/**
 * to filter unwanted fields in an array or an object
 * @param {object} rawData data that needs filtering
 * @param {string[]} attrsToOmit attributes that are unwanted
 * @param {boolean} includingTS automatically delete 'createdAt' and 'updatedAt'
 * @returns data after filtering
 */
export const omitFields = (rawData: any, attrsToOmit: string[] = attrs, includingTS: Boolean = false): typeof rawData => {
  
  if (!rawData || (!isArray(rawData) && !isObject(rawData))) return rawData
  if (includingTS) attrsToOmit = [ ...attrsToOmit, 'createdAt', 'updatedAt' ]
  
  // check data type
  if (isArray(rawData)) {
    return rawData.map((data: any) => {
      Object.keys(data).forEach(attr => {
        if (attrsToOmit.includes(attr)) delete data[attr]
      })
      return data
    })
  } else {
    Object.keys(rawData).forEach(attr => {
      if (attrsToOmit.includes(attr)) delete rawData[attr]
    })
    return rawData
  }
}

export const encryptMD5 = (plainText: string): string => {
  return crypto.createHash('md5').update(plainText).update(keys.MD5_PRIVATE_KEY).digest('hex')
}

/**
 * check if the parameter is an instance of Error
 * @param {any} p  
 * @returns 
 */
export const isError = (p: any): boolean => {
  return p instanceof BaseException || p instanceof Error
}

/**
 * check if the parameter is an instance of null
 * @param {any} p  
 * @returns boolean
 */
export const queryIsNull = (p: any): boolean => {
  return p == null || p == 'null'
}

/**
 * create an object including all criteria for dynamic searching
 * @param {object} o
 * @returns {object} criteria for 'where' clause
 */
export const createCriteria = (o: any, attrs?: string[]|null) => {
  if (!(o instanceof Object)) return {}
  let criteria = {}
  // if attrs is provided, iterate the array
  // if the attribute does not exist in object, ignore it
  if (attrs) {
    for (let attribute of attrs) {
      if (o.hasOwnProperty(attribute) && !queryIsNull(o[attribute]) && !criteria.hasOwnProperty(attribute)) {
        Object.defineProperty(criteria, attribute, {
          value: o[attribute],
          enumerable: true,
          writable: true,
          configurable: true, // can be removed
        })
      }
    }
  } else {
    for (let attribute in o) {
      if (!criteria.hasOwnProperty(attribute) && !queryIsNull(o[attribute]) && attribute != 'pager') {
        Object.defineProperty(criteria, attribute, {
          value: o[attribute],
          enumerable: true,
          writable: true,
          configurable: true,
        })
      }
    }
  }
  return criteria
}

/**
 * parse pager from body into [limit, offset]
 * @param query 
 * @returns [limit, offset]
 */
export const getPager = (body: any) => {
  if (!body.hasOwnProperty('pager')) {
    return [1000000, 0]
  }
  const { pager } = body
  const { page, size } = pager
  const p = page || 1 // default 1
  const s = size || 20 // default 20
  return [s, (p - 1) * s]
}

export const getPagerFromQuery = (query: any) => {
  const { page, size } = query
  const p = page || 1 // default 1
  const s = size || 20 // default 20
  return [s, (p - 1) * s]
}

/**
 * get current unix timestamp
 * @returns current unix timestamp
 */
export const getUnixTS = (): number => {
  return Math.floor(new Date().getTime() / 1000)
}

export const getTS = (): number => {
  return new Date().getTime()
}

export const generateDateByTs = (ts?: number|undefined): String => {
  if (!ts) ts = getTS()
  return moment(ts).format('YYMMDDhhmmss')
}

/**
 * if v is null or undefined, return true
 * @param v 
 * @returns 
 */
export const isEmptyValue = (v: any): Boolean => v === null || v === undefined

/**
 */
export const withAuth = (req: any, auth?: Number): Boolean => {
  return req.token
}