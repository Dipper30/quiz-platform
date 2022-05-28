import BaseService from './BaseService'
import fs from 'fs'
import { errCode } from '../config'
import { getTS } from '../utils/tools'
import { FileException } from '../exception'

class File extends BaseService {
  
  constructor () {
    super()
  }

  async writeImage(files: any, config: { qid: number }): Promise<any> {
    try {
      let removed = false
      if (!Array.isArray(files)) files = [files]
      let len = files.length
      for (let i = 0; i < len; i++) {
        const file = files[i]
        const { mimetype, data, name } = file
        const fileName = name.split('.')[0]
        const basePath = `images/questions/${config.qid}`
        const fileType = mimetype.split('/')[1]
        const ts = getTS()
        const url = `${basePath}/${ts}_${fileName}.${fileType}`
        if (!removed) {
          const rm = await this.delDirRecursive(url)
          if (!rm) throw new FileException(errCode.DIR_BUILD_ERROR)
          removed = true
        }
        await this.writeFile(url, data)
        if (i == len - 1) return true
      }
      return true
    } catch (error) {
      return error
    }
  }

  async writeFile (url: string, f: any) {
    try {
      const dir = await this.mkDirRecursive(url)
      if (!dir) throw new FileException(errCode.DIR_BUILD_ERROR)

      return fs.writeFile(url, f, (err: any) => err ? false : true)
      
    } catch (error) {
      return error
    }
  }

  async readImage (qid: number) {
    try {
      const dir = `images/questions/${qid}`

      if (!fs.existsSync(dir)) return []
      const files = fs.readdirSync(dir)
      const res: any[] = []
      files.forEach((item, index) => {
        const path = dir + '/' + item
        const type = item.split('.')[1]
        const base64data = fs.readFileSync(path, { encoding: 'base64' })
        res.push({ type, data: base64data })
      })
      return res
    } catch (error) {
      return false
    }
  
  }

  async mkDirRecursive (path: string) {
    try {
      const ps = path.split('/')
      ps.pop() // pop file name
      let [currentPath, ...rest] = ps
      if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath)
      for (let p of rest) {
        currentPath += `/${p}`
        if (!fs.existsSync(currentPath)) fs.mkdirSync(currentPath)
      }
      
      return new Promise((resolve: any, reject: any) => {
        fs.writeFile('path', '', () => resolve(true))
      }).catch(err => false)
    } catch (error) {
      return false
    }
  }

  // remove directory recursively
  async delDirRecursive (path: string){
    try {
      let dirArr = path.split('/')
      dirArr.pop()
      const dir = dirArr.join('/')
      let files = []
      if (fs.existsSync(dir)) {
        files = fs.readdirSync(dir)
        files.forEach((file, index) => {
          const curPath = dir + '/' + file
          if (fs.statSync(curPath).isDirectory()) {
            this.delDirRecursive(curPath) // remove dir recursively
          } else {
            fs.unlinkSync(curPath) // remove file
          }
        })
        fs.rmdirSync(dir)
        return true
      } else return true
    } catch (error) {
      return false
    }
  }

}

export default new File()