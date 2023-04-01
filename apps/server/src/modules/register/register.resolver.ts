import {
  Arg,
  Args,
  Float,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
} from 'type-graphql'
import { ArgsType, Field, Int } from 'type-graphql'
import { Service } from 'typedi'
import { RegisterService } from './register.service'
import { RegisterResponse, RegistrationInput } from './register.types'

@Service()
@Resolver(RegisterResponse)
export class RegisterResolver {
  constructor(private readonly registerService: RegisterService) {}

  @Mutation(returns => RegisterResponse)
  async register(@Arg('data') data: RegistrationInput): Promise<RegisterResponse> {
    try {
      await this.registerService.register(data)
      return {
        success: true,
      }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        error: 'This email address is either invalid or already taken.',
      }
    }
  }
}
