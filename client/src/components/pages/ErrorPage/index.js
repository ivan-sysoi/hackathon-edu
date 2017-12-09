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
        title="Ошибка 500"
      >
        <h1>500 </h1>
        <h2>К сожалению, произошла ошибка. <br/> В ближайшее время все будет исправлено. <br/> Попробуйте зайти позже.</h2>
      </MinimalTemplate>
    )
  }
}

export default ErrorPage
