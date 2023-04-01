import dotenv from 'dotenv'
import { join } from 'path'
import 'reflect-metadata'

dotenv.config({ path: join(__dirname, '../.env.test'), override: true })

import { app } from '../src/app'
import { createAxiosMock } from './mock'

if (process.env.TEST_TYPE === 'unit') {
  createAxiosMock()
} else {
  app.on('ready', () => {
    console.log('app ready')
  })
}
