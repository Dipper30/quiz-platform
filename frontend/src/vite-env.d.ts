/// <reference types="vite/client" />

type REACT_APP_ENVIRONMENT = 'development' | 'production'

type SeqType = 'plain' | 'editing'

type Editing = 'plain' | 'editing'

interface User {
  username: string,
  id: number,
  chatroomId: number|null,
}

interface HTTPResponse {
  msg: string,
  code: number,
  data: any,
}

interface QuizType {
  title: string,
  tag: string,
  description: string,
  totalPoints: number,
  sections: SectionType[],
  visible?: boolean,
  [key: string]: any,
}

interface SectionType {
  id?: number,
  title: string,
  domains: DomainType[],
}

interface DomainType {
  id?: number,
  domainName: string,
  proportion: number,
  seq: number,
  parts: PartType[],
  name?: string,
  [key: string]: any,
}

interface PartType {
  id?: number,
  partName: string,
  seq: number,
  choices: PartChoiceType[],
  recommendations: RecommendationType[],
  description: string,
  totalPoints?: number,
  domainName?: string,
  name?: string,
  sectionName?: string
}

interface PartChoiceType {
  id?: number,
  description: string,
  willShowSubQuestions: boolean,
  seq: number,
  show_sub?: boolean,
}
interface RecommendationType {
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

interface QuestionType {
  id?: number,
  description: string,
  seq: number,
  partId?: number,
  isMulti: boolean,
  imgSrc?: string | null,
  choices: ChoiceType[],
  partChoices?: any[],
  is_multi?: boolean,
  name?: string,
}

interface ChoiceType {
  id?: number,
  description: string,
  seq: number,
  score: number,
  questionId?: number,
}