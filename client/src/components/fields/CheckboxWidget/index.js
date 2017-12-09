import React from 'react'
import PropTypes from 'prop-types'
import SelectionControl from 'react-md/lib/SelectionControls/SelectionControl'

import { InputContainer } from 'components'
import { isBrowser } from 'config'

if (isBrowser) {
  require('./styles.scss')
}

const CheckboxWidget = (props) => {
  //console.log('CheckboxWidget: ', props)
  const options = props.options || {}
  const type = options.type || 'checkbox'

  return (
    <InputContainer
      helpText={options.description}
    >
      <SelectionControl
        id={props.id}
        name={props.id}
        className={'checkbox-widget'}
        label={props.schema.title}
        checked={props.value || false}
        disabled={props.disabled}
        required={props.required}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        type={type}
      />
    </InputContainer>
  )
}

CheckboxWidget.propTypes = {
  options: PropTypes.object,
}

export default CheckboxWidget
