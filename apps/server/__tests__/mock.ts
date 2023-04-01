import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { accessTokenResponse, emailResponse, meResponse } from './example-data/linkedin-responses'

export const createAxiosMock = () =>
  new MockAdapter(axios)
    .onGet(/api\.linkedin\.com\/v2\/me/)
    .reply(200, JSON.stringify(meResponse))
    .onGet(/api\.linkedin\.com\/v2\/emailAddress/)
    .reply(200, JSON.stringify(emailResponse))
    .onPost('https://www.linkedin.com/oauth/v2/accessToken')
    .reply(200, JSON.stringify(accessTokenResponse))
