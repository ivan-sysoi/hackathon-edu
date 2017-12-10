import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { selectCurrentUserRole } from 'store/auth/selectors'

export function teacherRoleRequired(opts = { redirectUrl: '/', }) {

  return function (DecoratedComponent) {
    const wrapper = function (props) {
      console.log(props.userRole)
      if (props.userRole !== 'teacher') {
        return <Redirect to={opts.redirectUrl}/>
      }
      return (
        <DecoratedComponent {...props} />
      )
    }

    return connect(
      state => ({
        userRole: selectCurrentUserRole(state),
      }),
    )(wrapper)
  }

}
