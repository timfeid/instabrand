import { Components, Mailable } from '@tellimer/mailable'
import { Token } from '@instabrand/data'
import React from 'react'

const { Email, EmailRow, EmailCol, EmailTable } = Components

export class ActivationMailable extends Mailable {
  constructor(private readonly token: Token) {
    super()
  }

  subject = 'Activate your account'

  view() {
    return (
      <Email>
        <EmailTable>
          <EmailRow>
            <EmailCol>
              <a href={`/activation/${this.token.userId}/${this.token.token}`}>
                Click here to activate your account! {this.token.token}
              </a>
            </EmailCol>
          </EmailRow>
        </EmailTable>
      </Email>
    )
  }
}
