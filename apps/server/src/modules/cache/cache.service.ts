import redis, { RedisClientType } from 'redis'
import Container, { Service } from 'typedi'
import { ConfigService } from '../config/config.service'
import { Serializer } from './serializer'

class JSONSerializer<T> extends Serializer<T> {
  encode(item: T) {
    return JSON.stringify(item)
  }

  decode(str: string) {
    console.log('default serialzier decode')
    return JSON.parse(str)
  }
}

const defaultSerialzier = new JSONSerializer()

@Service()
export class CacheService {
  constructor(
    private readonly redis: RedisClientType = Container.get('redis'),
    private readonly config: ConfigService,
  ) {}

  rememberForever<T>(
    key: string,
    cb: () => Promise<T> | T,
    serializer: Serializer<T> = defaultSerialzier,
  ): Promise<T> {
    return this.remember(key, 604800, cb, serializer)
  }

  async remember<T>(
    key: string,
    timeInMinutes: number,
    cb: () => Promise<T> | T,
    serializer: Serializer<T> = defaultSerialzier,
  ): Promise<T> {
    if (this.config.skipCaching) {
      return await cb()
    }

    const existingValue = await this.get<T>(key, null, serializer)
    if (existingValue) {
      return existingValue
    }

    const value = await cb()
    await this.redis.set(key, serializer.encode(value), {
      EX: 60 * timeInMinutes,
    })

    return value
  }

  async get<T>(
    key: string,
    defaultValue: T = null,
    serializer: Serializer<T> = defaultSerialzier,
  ): Promise<T> {
    const response = await this.redis.get(key)
    if (response) {
      return serializer.decode(response)
    }
  }

  async forget(key: string): Promise<number> {
    return await this.redis.del(key)
  }
}
