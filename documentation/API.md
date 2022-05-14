[toc]

# BACKEND API

## User

### Login

```js
{
  url: 'login',
  method: 'post',
  param: {
    username: String, // string
    password: String, // string
  },
  return_ok: {
    code: 201,
    msg: 'ok',
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

## Quiz

### Create Quiz

```ts
{
  url: 'initQuiz',
  method: 'post',
  param: {
    title: String,
    tag?: String,
    description: String,
    total_points: Number,
    sections: [
      {
        title: String,
        domains: [
          {
            domainName: String,
            proportion: Number,
            seq: Number,
            parts: [
              partName: String,
              seq: Number,
              choices: [
                {
                  description: String,
                  willShowSubQuestions: Boolean,
                  seq: Number,
                }
              ],
              recommendations: [
                {
                  showUnder: Number,
                  link: String,
                }
              ]
            ]
          }
        ],
      },
    ]
  },
  header: {
    token: String,
  },
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
      id: Number,
    }
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```


### Toggle Quiz Visibility

```ts
{
  url: 'toggleVisibility',
  method: 'post',
  param: {
    qid: Number
  },
  return_ok: {
    code: 201,
    msg: 'ok',
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Get Quizzes Abstract

```ts
{
  url: 'quizzes',
  method: 'get',
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
      quizzes: [
        {
          id: Number,
          title: String,
          tag?: String,
          description: String,
          totalPoints: Number,
          sections: [
            title: String,
            domains: [
              {
                domainName: String,
                proportion: Number,
                parts: [
                  partName: String,
                  choices: [
                    {
                      description: String,
                      willShowSubQuestions: Boolean,
                    }
                  ],
                  recommendations: [
                    {
                      score: Number,
                      link: String,
                    }
                  ]
                ]
              }
            ]
          ],
        },
      ]
    }
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Get Quizzes Abstract Including Invisible Ones

```ts
{
  url: 'allQuizzes',
  method: 'get',
  header: {
    token: String, // require auth
  },
  // same as above
}
```

### Get Quiz

```ts
{
  url: 'quiz/:id',
  method: 'get',
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
      id: Number,
      title: String,
      tag?: String,
      description: String,
      total_points: Number,
    }
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Get Questions

```ts
{
  // by default pcid will be 0 and you will get all questions
  url: 'questions?pid=[part_id][&pcid=[partchoice_id]]',
  method: 'get',
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
      partId: Number,
      questions: [
        {
          id: Number,
          description: String,
          seq: Number,
          is_multi: Boolean,
          part_id: Number,
          imgSrc: String | NULL,
          choices: [
            {
              id: Number,
              seq: Number,
              description: String,
              question_id: Number,
              score?: Number, // this field should be invisible to users
            }
          ]
        }
      ]
    }
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Get Questions With Score

show scores of each choice, require token

```ts
{
  // by default pcid will be 0 and you will get all questions
  url: 'questionsWithScore?pid=[part_id][&pcid=[partchoice_id]]',
  method: 'get',
  header: {
    token: String, // show choice scores with token, otherwise hide scores
  },
  // same as get questions above
}
```

### Add Question

```ts
{
  url: 'question',
  method: 'post',
  param: {
    description: String,
    seq: Number, // if rewrite, validate the sequence
    isMulti: Boolean, // indicates if user can select more than one choices
    partId: Number,
    partChoices: Number[],
    choices: [
      {
        description: String,
        score: Number,
      }
    ],
    imgSrc: String | NULL,
  },
  header: {
    token: String,
  },
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
    }
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Delete Question

```ts
{
  url: 'deleteQuestion',
  method: 'post',
  param: {
    id: Number,
  },
  header: {
    token: String,
  },
  return_ok: {
    code: 201,
    msg: 'deleted',
    data: null,
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Add/Update Choice

```ts
{
  url: 'choice',
  method: 'post',
  param: {
    id?: Number, // if undefined, new choice will be added, otherwise rewrite
    seq: Number, // if rewrite, validate the sequence
    description: String,
    questionId: Number,
    score: Number,
  },
  header: {
    token: String,
  },
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
      choice: {
        id: Number,
        seq: Number,
        description: String,
        questionId: Number,
        score: Number,
      }
    }
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Delete Choice

```ts
{
  url: 'deleteChoice',
  method: 'post',
  param: {
    id: Number,
  },
  header: {
    token: String,
  },
  return_ok: {
    code: 201,
    msg: 'ok',
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```

### Submit Quiz

```ts
{
  url: 'submit',
  method: 'post',
  param: {
    quizId: Number,
    parts: [
      {
        pid: Number, // part id
        pcid: Number, // part choice id
        choices: [
          {
            qid: Number, // question id
            cid: Number[], // arr of selected choice ids
          },
        ]
      }
    ]
  },
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
      totalScore: Number,
      parts: [
        {
          part_id: Number,
          name: String,
          score: Number,
        }
      ]
    }
  },
  return_fail: {
    code: ,
    msg: '',
  }
}
```