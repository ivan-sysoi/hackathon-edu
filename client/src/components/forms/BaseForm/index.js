import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-jsonschema-form'
import { connect } from 'react-redux'

import {
  FieldTemplate,
  OneSelectWidget,
  CheckboxWidget,
  TextWidget,
} from 'components'
import { setFormData, addErrorToast } from 'store/actions'
import { selectFormState } from 'store/selectors'


const fields = {

}

const widgets = {
  SelectWidget: OneSelectWidget,
  TextWidget,
  TextareaWidget: props => (
    <TextWidget
      {...props}
      options={{
        ...props.options,
        rows: 3,
        maxRows: 10,
      }}
    />
  ),
  PasswordWidget: props => (
    <TextWidget
      {...props}
      options={{
        ...props.options,
        type: 'password',
      }}
    />
  ),
  EmailWidget: props => (
    <TextWidget
      {...props}
    />
  ),

  CheckboxWidget,

}


@connect(
  (state, props) => {
    //console.log('BaseForm connect', props)
    if (!props.name) {
      throw new Error('BaseForm requires name', props)
    }
    return {
      formState: selectFormState(state, props.name),
    }

  },
  dispatch => ({
    setFormData: (formName, data) => dispatch(setFormData(formName, data)),
    addErrorToast: text => dispatch(addErrorToast(text)),
  }),
)
class BaseForm extends Component {
  static propTypes = {
    setFormData: PropTypes.func.isRequired,
    addErrorToast: PropTypes.func.isRequired,
    onError: PropTypes.func,
    validate: PropTypes.func,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    submitRef: PropTypes.func,
    name: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    showErrorToast: PropTypes.bool,
  }

  static defaultProps = {
    onChange: null,
    onSubmit: null,
    onError: null,
    validate: null,
    showErrorToast: false,
    uiSchema: null,
    children: null,
    submitRef: null,
    className: '',
  }

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onError = this.onError.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isFormStateChanged = this.props.formState.id !== nextProps.formState.id
    const isSchemaChanged = this.props.schema !== nextProps.schema || this.props.uiSchema !== nextProps.uiSchema
    const shouldUpdate = isFormStateChanged || isSchemaChanged

    //console.log('BaseForm shouldUpdate: ', shouldUpdate)

    return shouldUpdate
  }

  onChange(data) {
    //console.log('BaseForm Change: ', this.props.formState)
    this.props.setFormData(this.props.name, data.formData)
  }

  onError(data) {
    console.log(`${this.props.name} errors: `, data)
    if (this.props.showErrorToast) {
      this.props.addErrorToast('Заполните правильно форму для продолжения')
    }
    if (this.props.onError !== null) {
      this.props.onError(data)
    }
  }

  render() {
    //console.log('BaseForm render', this.props.formState)

    return (
      <Form
        className={this.props.className}
        //liveValidate
        fields={fields}
        FieldTemplate={FieldTemplate}
        onError={this.onError}
        //ArrayFieldTemplate={ArrayFieldTemplate}
        widgets={widgets}
        showErrorList={false}
        //transformErrors={transformErrors}
        onChange={this.props.onChange || this.onChange}
        schema={this.props.schema}
        validate={this.props.validate}
        formData={this.props.formState.data}
        uiSchema={this.props.uiSchema}
        onSubmit={this.props.onSubmit}
      >
        {this.props.children !== null && this.props.children}
        {this.props.submitRef !== null ? (
          <input
            type="submit"
            style={{ display: 'none' }}
            ref={this.props.submitRef}
          />
        ) : null}
      </Form>
    )
  }
}

export default BaseForm
