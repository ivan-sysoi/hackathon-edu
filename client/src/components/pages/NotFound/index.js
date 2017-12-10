import React, { Component } from 'react'
import { MinimalTemplate } from 'components'

class NotFound extends Component {

  componentWillMount() {
    const { staticContext } = this.props
    if (staticContext) {
      staticContext.status = 404
    }
  }

  render() {
    return (
      <MinimalTemplate
        title="Not found"
      >
        <h1>404</h1>
        <h2>Not found</h2>
      </MinimalTemplate>
    )
  }
}

export default NotFound
