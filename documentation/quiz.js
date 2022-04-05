

/**
 * Below is the data structure of how you create a quiz
 */

// JSON file
const quiz =

{
  "title": "My Quiz 1",
  "domains": [
    {
      "domainName": "Programming",
      "proportion": "25", // this domain accounts for 25% of the total score of the quiz
      "parts": [
        {
          "partName": "Python",
          "choices": [
            {
              "description": "I have never used Python.",
              "willShowSubQuesitons": false
            },
            {
              "description": "I have some basic knowledge about Python.",
              "willShowSubQuesitons": true
            },
            {
              "description": "I am proficient in Python.",
              "willShowSubQuesitons": true
            },
          ],
          "recommendations": [
            {
              // if the user scores less than or equal to 25% of the total points of this part,
              // he/she will be provided by the following link
              "score": 25, 
              "link": "https://www.google.com"
            },
            {
              "score": 50,
              "link": "https://www.google.com"
            },
            {
              "score": 75,
              "link": "https://www.google.com"
            },
            {
              "score": 100,
              "link": "https://www.google.com"
            },
          ]
        },
        {
          // ...other part
        }
      ]
    },
    {
      "domainName": "Tool",
      "proportion": "75", // this domain accounts for 75% of the total score of the quiz
      "parts": [
        // ...
      ]
    },
  ],
}