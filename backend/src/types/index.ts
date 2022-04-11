export interface Choice {
  description: String,
  willShowSubQuestions: Boolean,
  seq: Number,
}

export interface Recommendation {
  id?: Number,
  showUnder: Number,
  link: String,
}

export interface Part {
  id?: Number,
  partName: String,
  seq: number,
  choices: Choice[],
  recommendations: Recommendation[],
}

export interface Domain {
  id?: Number,
  seq: number,
  domainName: String,
  proportion: Number,
  parts: Part[],
}

export interface InitQuiz {
  title: String,
  tag?: String,
  description: String,
  total_points: Number,
  domains: Domain[],
}

export interface Question {
  id?: Number,
  description: String,
  seq: Number, // if rewrite, validate the sequence
  isMulti: Boolean, // indicates if user can select more than one choices
  partId: Number,
  imgSrc: String | null,
  choices?: Choice[],
}

export interface Choice {
  id?: Number,
  seq: Number,
  description: String,
  questionId: Number,
  score: Number,
}

export interface GetQuiz {
  id?: Number,
  title: String,
  tag: String,
  description: String,
  total_points: Number,
  domains: Domain[],
}