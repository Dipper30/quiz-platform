import { errCode } from '../config'
import BaseException from './BaseException'

class FileException extends BaseException {

  constructor (code: number = errCode.FILE_ERROR, message?: string) {
    super(code, message)
  }
}

export default FileException