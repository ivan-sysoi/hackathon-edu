import React, { Component } from 'react'
import { MinimalTemplate } from 'components'

class ErrorPage extends Component {

  componentWillMount() {
    const { staticContext } = this.props
    if (staticContext) {
      staticContext.status = 500
    }
  }

  render() {
    return (
      <MinimalTemplate
        title="Error 500"
      >
        <h1>500 </h1>
        <h2>Server Error</h2>
      </MinimalTemplate>
    )
  }
}

export default ErrorPage
