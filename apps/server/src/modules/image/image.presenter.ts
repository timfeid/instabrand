import { Image as ImageModel } from '@instabrand/data'
import { Service } from 'typedi'
import { UrlService } from '../url/url.service'
import { Image } from './image.schema'

@Service()
export class ImagePresenter {
  constructor(private readonly urlService: UrlService) {}

  present(image: ImageModel, alt: string): Image {
    return {
      src: this.urlService.getCdnUrl(image.url),
      alt,
      srcset: `${image.url}\n${image.url2x} 2x`,
      pictureSources: [
        {
          media: '(min-width: 1367px)',
          srcset: `${image.urlDesktop},\n${image.urlDesktop2x} 2x`,
        },
        {
          media: '(min-width: 768px)',
          srcset: `${image.urlTablet},\n${image.urlTablet2x} 2x`,
        },
        {
          media: '(min-width: 480px)',
          srcset: `${image.urlMobile},\n${image.urlMobile2x} 2x`,
        },
      ],
    }
  }
}
