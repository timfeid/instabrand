import { S3Client } from '@aws-sdk/client-s3'
import { Service } from 'typedi'
import { ConfigService } from '../config/config.service'

@Service()
export class UrlService {
  constructor(private readonly configService: ConfigService, private readonly s3: S3Client) {}

  getCdnUrl(...uris: string[]) {
    if (uris[0].substring(0, 4) === 'http') {
      return uris[0]
    }

    return this.concatUrl(this.configService.cdnUrlPrefix, ...uris)
  }

  trimSlashLeft(str = '') {
    if (str) {
      return str.replace(/^\//, '')
    }
  }

  trimSlashRight(str = '') {
    if (str) {
      return str.replace(/\/$/, '')
    }
  }

  trimSlash(str = '') {
    if (str) {
      return this.trimSlashLeft(this.trimSlashRight(str))
    }
  }

  concatUrl(hostname: string, ...uris: string[]) {
    return `${this.trimSlashRight(hostname)}/${uris.map(this.trimSlashLeft).join('/')}`
  }
}
