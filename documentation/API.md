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
          total_points: Number,
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
  url: 'questions?pid=[part_id]',
  method: 'get',
  header: {
    token: String, // show choice scores with token, otherwise hide scores
  },
  return_ok: {
    code: 201,
    msg: 'ok',
    data: {
      part_id: Number,
      questions: [
        {
          id: Number,
          description: String,
          seq: Number,
          multi_choices: Boolean,
          part_id: Number,
          img_src: String | NULL,
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

### Add/Update Question

```ts
{
  url: 'question',
  method: 'post',
  param: {
    id?: Number, // if undefined, new question will be added, otherwise rewrite
    description: String,
    seq: Number, // if rewrite, validate the sequence
    multi_choices: Boolean, // indicates if user can select more than one choices
    part_id: Number,
    img_src: String | NULL,
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

### Add/Update Choice

```ts
{
  url: 'choice',
  method: 'post',
  param: {
    id?: Number, // if undefined, new choice will be added, otherwise rewrite
    seq: Number, // if rewrite, validate the sequence
    description: String,
    question_id: Number,
    score: Number,
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