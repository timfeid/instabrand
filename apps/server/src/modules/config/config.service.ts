import { readFileSync } from 'fs'
import path from 'path'
import { Service } from 'typedi'

@Service()
export class ConfigService {
  constructor(protected readonly env: Record<string, string> = process.env) {}

  get port() {
    return parseInt(this.env.PORT || '8787', 10)
  }

  get stripeKey() {
    return this.env.STRIPE_SECRET || ''
  }

  get jwtPublicKey() {
    return readFileSync(path.join('jwt.public.key'), 'utf8')
  }

  get jwtPrivateKey() {
    return readFileSync(path.join('jwt.private.key'), 'utf8')
  }

  get redisUrl() {
    return this.env.REDIS_URL || 'redis://localhost/'
  }

  get skipCaching() {
    return this.env.SKIP_CACHING === 'true'
  }

  get cdnUrlPrefix() {
    return this.env.CDN_URL || ''
  }
}
