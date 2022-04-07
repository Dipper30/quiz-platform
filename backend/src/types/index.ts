export interface Choice {
  description: String,
  willShowSubQuestions: Boolean,
  seq: Number,
}

export interface Recommendation {
  showUnder: Number,
  link: String,
}

export interface Part {
  partName: String,
  choices: Choice[],
  recommendations: Recommendation[],
}

export interface Domain {
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
}

export interface Choice {
  id?: Number,
  seq: Number,
  description: String,
  questionId: Number,
  score: Number,
}