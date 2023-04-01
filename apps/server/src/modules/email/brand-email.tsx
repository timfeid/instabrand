import { BrandHeader } from './brand-header'
import { BrandFooter } from './brand-footer'
import { Brand, Address, State } from '@instabrand/data'
import { Components } from '@tellimer/mailable'
import React from 'react'

const { Email } = Components

type Props = {
  brand: Brand & {
    address: Address & {
      state: State
    }
  }
  children: any
}

export class BrandEmail extends React.Component<Props> {
  render() {
    return (
      <Email
        header={<BrandHeader brand={this.props.brand} />}
        footer={<BrandFooter brand={this.props.brand} />}
      >
        {this.props.children}
      </Email>
    )
  }
}
