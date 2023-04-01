import { Brand } from '@instabrand/data'
import { Components } from '@tellimer/mailable'
import React from 'react'
import Container from 'typedi'
import { UrlService } from '../url/url.service'

const { EmailTable, EmailRow, EmailCol } = Components

type Props = {
  brand: Brand
}

export class BrandHeader extends React.Component<Props> {
  render() {
    const urlService = Container.get(UrlService)
    return (
      <EmailTable className="mb-4">
        <EmailRow>
          <EmailCol
            className="py-4 px-4"
            style={{ height: 48, lineHeight: 0, background: this.props.brand.color }}
          >
            <img src={urlService.getCdnUrl(this.props.brand.logo)} height="48" />
          </EmailCol>
        </EmailRow>
      </EmailTable>
    )
  }
}
