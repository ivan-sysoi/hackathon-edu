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
        title="Страница не найдена"
      >
        <h1>404</h1>
        <h2>Такой страницы здесь нет :)</h2>
      </MinimalTemplate>
    )
  }
}

export default NotFound
