import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-md/lib/Buttons/Button'
import { Link } from 'react-router-dom'

import { BaseForm } from 'components'


const schema = {
  type: 'object',
  required: [
    'answer',
  ],
  properties: {
    answer: { type: 'string', title: 'Ответ' },
  },
}

const uiSchema = {
  answer: {
    'ui:options': {
      rows: 5,
    }
  }
}

const AnswerFormName = 'AnswerForm'

class AnswerForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: null,
  }

  static formName = AnswerFormName

  render() {
    return (
      <BaseForm
        name={this.constructor.formName}
        className="form"
        onSubmit={this.props.onSubmit}
        schema={schema}
        uiSchema={uiSchema}
        children={this.props.children}
      />
    )
  }
}

export default AnswerForm
