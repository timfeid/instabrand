import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PictureSources {
  @Field()
  media: string

  @Field()
  srcset: string
}

@ObjectType()
export class Image {
  @Field(() => [PictureSources])
  pictureSources: PictureSources[]

  @Field()
  src: string

  @Field()
  srcset: string

  @Field()
  alt: string
}
