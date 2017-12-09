import React from 'react'
import PropTypes from 'prop-types'


const FieldTemplate = (props) => {
  const {id, classNames, label, help, required, description, errors, children} = props
  //console.log(props)
  return (
    <div className={`form-field ${classNames}`}>
      {/*<label htmlFor={id}>{label}{required ? "*" : null}</label>*/}
      {/*{description}*/}
      {children}
      {errors}
      {help}
    </div>
  )
}

FieldTemplate.propTypes = {

}

export default FieldTemplate
