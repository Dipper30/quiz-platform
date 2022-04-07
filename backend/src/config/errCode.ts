enum errCode {
  // auth error code
  REGISTRATION_ERROR = 10000,
  LOGIN_ERROR = 10001,
  TOKEN_ERROR = 10002,
  ACCESS_ERROR = 10003,
  AUTH_ERROR = 10004, // default

  // common error
  PAGE_ERROR = 40000,
  PAGE_REDIRECTED = 40001,
  PARAMETER_ERROR = 40003,
  PAGE_NOT_FOUND = 40004,
  DATABASE_ERROR = 40005,
  DATABASE_TRANSACTION_ERROR = 40006,
  INVALID_ID = 40007,

  // user error code
  USER_ERROR = 60000,
  USER_EXISTS = 60001,

  // chatroom
  QUIZ_ERROR = 70001,

  // file error code
  FILE_ERROR = 80000,
  NO_FILE_UPLOADED = 80001,
  FILE_TYPE_ERROR = 80002,
  DIR_BUILD_ERROR = 80003,
  DIR_NOT_EXISTS = 80004,

  // message error code
  MESSAGE_ERROR = 90000,
  FEEDBACK_ERROR = 90001,
}

export default errCode