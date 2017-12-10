import React from 'react'
import PropTypes from 'prop-types'
import TextField  from 'react-md/lib/TextFields/TextField'
import isInteger from 'lodash/isInteger'

const TextWidget = (props) => {
  const type = props.options.type || props.schema.type === 'number' ? 'number' : 'text'

  return (
    <TextField
      id={props.id}
      name={props.id}
      label={props.schema.title}
      lineDirection={'left'}
      fullWidth
      value={props.value}
      disabled={props.disabled}
      required={props.required}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      maxLength={props.schema.maxLength}
      placeholder={props.placeholder}
      error={false}
      className={props.className}
      ref={props.inputRef}
      helpText={props.options.description}
      min={props.schema.minimum}
      max={props.schema.maximum}
      step={props.schema.multipleOf}
      rows={props.options.rows}
      maxRows={isInteger(props.options.rows) ? (props.options.maxRows || 10) : undefined}
      type={type}
    />
  )
}

TextWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    maxLength: PropTypes.number,
    minimum: PropTypes.number,
    maximum: PropTypes.number,
    multipleOf: PropTypes.number,
    type: PropTypes.oneOf(['string', 'number']),
  }),
  uiSchema: PropTypes.object,
  options: PropTypes.shape({
    description: PropTypes.string,
    rows: PropTypes.number,
    maxRows: PropTypes.number,
    type: PropTypes.oneOf(['text', 'number', 'email', 'search', 'tel', 'url', 'password']),
  }),
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  inputRef: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
}

TextWidget.defaultProps = {
  className: '',
  inputRef: null,
  onFocus: null,
  onBlur: null,
  schema: {},
  uiSchema: {},
  options: {},
  value: '',
  required: false,
  disabled: false,
  placeholder: undefined,
}

export default TextWidget
