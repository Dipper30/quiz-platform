/// <reference types="vite/client" />

declare type REACT_APP_ENVIRONMENT = 'development' | 'production'

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