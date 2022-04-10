/// <reference types="vite/client" />

declare type REACT_APP_ENVIRONMENT = 'development' | 'production'

export interface User {
  username: string,
  id: number,
  chatroomId: number|null,
}