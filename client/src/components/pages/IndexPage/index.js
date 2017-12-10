import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Redirect} from 'react-router'

import { isBrowser } from 'config'


if (isBrowser) {
  require('./styles.scss')
}

class IndexPage extends PureComponent {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Redirect
        to="/courses"
      />
    )
  }
}

export default IndexPage
