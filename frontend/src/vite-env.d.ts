/// <reference types="vite/client" />

declare type REACT_APP_ENVIRONMENT = 'development' | 'production'

declare type SeqType = 'plain' | 'editing'

declare type Editing = 'plain' | 'editing'

export interface User {
  username: string,
  id: number,
  chatroomId: number|null,
}

declare interface HTTPResponse {
  msg: string,
  code: number,
  data: any,
}

interface Quiz {
  title: string,
  tag: string,
  description: string,
  totalPoints: number,
  domains: Domain[],
  [key: string]: any,
}

interface Domain {
  id?: number,
  domainName: string,
  proportion: number,
  seq: number,
  parts: Part[],
  name?: string,
  [key: string]: any,
}

interface Part {
  id?: number,
  partName: string,
  seq: number,
  choices: PartChoice[],
  recommendations: Recommendation[],
  totalPoints?: number,
  domainName?: string,
  name?: string,
}

interface PartChoice {
  id?: number,
  description: string,
  willShowSubQuestions: boolean,
  seq: number,
}
interface Recommendation {
  id?: number,
  showUnder: number,
  show_under?: number,
  link: string,
}

interface APIResponse {
  code: number,
  msg: string,
  data: any,
}
