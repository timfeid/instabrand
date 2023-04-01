import { Brand, Address, State } from '@instabrand/data'
import { Components } from '@tellimer/mailable'
import React from 'react'

const { EmailTable, EmailRow, EmailCol } = Components

type Props = {
  brand: Brand & {
    address: Address & {
      state: State
    }
  }
}

export class BrandFooter extends React.Component<Props> {
  render() {
    return (
      <EmailTable>
        <EmailRow>
          <EmailCol className="pt-8 text-center">
            {this.props.brand.name}
            <br />
            {this.props.brand.address.line1} {this.props.brand.address.city},{' '}
            {this.props.brand.address.state.abbreviation} {this.props.brand.address.zip}
          </EmailCol>
        </EmailRow>
      </EmailTable>
    )
  }
}
