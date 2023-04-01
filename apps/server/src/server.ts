import Container from 'typedi'
import { app } from './app'
import { ConfigService } from './modules/config/config.service'

app.on('ready', () => {
  const port = Container.get(ConfigService).port
  app.listen(port)

  console.log(`Listening http://localhost:${port}`)
})
