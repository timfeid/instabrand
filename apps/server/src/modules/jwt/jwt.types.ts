export type AccessTokenData = {
  sub: string
  type: TOKEN_AUDIENCE
}

export enum TOKEN_AUDIENCE {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}
