import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-md/lib/Buttons/Button'
import Card from 'react-md/lib/Cards/Card'
import CardTitle from 'react-md/lib/Cards/CardTitle'
import CardText from 'react-md/lib/Cards/CardText'
import CardActions from 'react-md/lib/Cards/CardActions'
import { connect } from 'react-redux'

import { isBrowser } from 'config'
import { PageTemplate, AddCourseForm } from 'components'


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
      <PageTemplate
        title="Главная"
      >



      </PageTemplate>
    )
  }
}

export default IndexPage
