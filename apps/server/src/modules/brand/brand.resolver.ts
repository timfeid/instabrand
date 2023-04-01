import { Args, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { UrlService } from '../url/url.service'
import { FindBrandArgs, Brand } from './brand.schemas'
import { BrandService } from './brand.service'

@Resolver(Brand)
@Service()
export class BrandResolver {
  constructor(
    private readonly brandService: BrandService,
    private readonly urlService: UrlService,
  ) {}

  @Query(() => Brand)
  async brand(@Args() args: FindBrandArgs) {
    return await this.brandService.findByDomainName(args.domainName)
  }

  @FieldResolver()
  logo(@Root() root: Brand) {
    if (!root.logo) {
      return null
    }

    return this.urlService.getCdnUrl(root.logo)
  }
}
