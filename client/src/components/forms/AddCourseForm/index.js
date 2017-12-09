import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-md/lib/Buttons/Button'
import { Link } from 'react-router-dom'

import { BaseForm } from 'components'


const schema = {
  type: 'object',
  required: [
    'title',
    'desc',
  ],
  properties: {
    title: { type: 'string', title: 'Заголовок' },
    desc: { type: 'string', title: 'Описание' },
  },
}

const uiSchema = {
  desc: {
    'ui:options': {
      rows: 10,
    }
  }
}

const AddCourseFormName = 'AddCourseForm'

class AddCourseForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: null,
  }

  static formName = AddCourseFormName

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

export default AddCourseForm
