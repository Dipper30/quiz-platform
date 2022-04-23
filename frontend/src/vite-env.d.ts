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
  sections: Section[],
  visible?: boolean,
  [key: string]: any,
}

interface Section {
  id?: number,
  title: string,
  domains: Domain[],
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
  sectionName?: string
}

interface PartChoice {
  id?: number,
  description: string,
  willShowSubQuestions: boolean,
  seq: number,
  show_sub?: boolean,
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

interface Question {
  id?: number,
  description: string,
  seq: number,
  partId?: number,
  isMulti: boolean,
  imgSrc?: string | null,
  choices: Choice[],
  partChoices?: any[],
  is_multi?: boolean,
}

interface Choice {
  id?: number,
  description: string,
  seq: number,
  score: number,
  questionId?: number,
}