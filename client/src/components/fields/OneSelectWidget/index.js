import React from 'react'
import PropTypes from 'prop-types'
import SelectField from 'react-md/lib/SelectFields'


const OneSelectWidget = (props) => {
  //console.log(props.id, props.options.enumOptions)
  return (
    <SelectField
      id={props.id}
      name={props.id}
      label={props.schema.title}
      className={props.className}
      value={props.value}
      disabled={props.disabled}
      required={props.required}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      placeholder={props.placeholder}
      itemLabel="label"
      itemValue="value"
      menuItems={props.options.enumOptions}
      error={false}
      fullWidth={props.options._fullWidth === undefined ? true : props.options._fullWidth}
      position={props.options._position === undefined ? SelectField.Positions.TOP_LEFT : props.options._position}
    />
  )
}

OneSelectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  schema: PropTypes.shape({
    title: PropTypes.string,
  }),
  options: PropTypes.shape({
    _fullWidth: PropTypes.bool,
    _position: PropTypes.oneOf(Object.values(SelectField.Positions)),
  }).isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
}

OneSelectWidget.defaultProps = {
  className: '',
  schema: {},
  placeholder: undefined,
  disabled: false,
  required: false,
  value: undefined,
  onFocus: undefined,
  onBlur: undefined,
}

export default OneSelectWidget
