import bcrypt from 'bcrypt'
import { Service } from 'typedi'

@Service()
export class PasswordService {
  async encrypt(password: string) {
    return bcrypt.hash(password, this.saltOrRounds())
  }

  async check(password: string, encrypted: string) {
    return bcrypt.compare(password, encrypted.replace(/^\$2y\$/, '$2a$'))
  }

  saltOrRounds() {
    return 10
  }
}
