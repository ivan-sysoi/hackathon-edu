import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Snackbar from 'react-md/lib/Snackbars'

import { removeToast } from 'store/actions'
import { selectToasts } from 'store/selectors'
import { isBrowser } from 'config'

if (isBrowser) {
  require('./styles.scss')
}

@connect(
  state => ({
    toasts: selectToasts(state),
  }),
  dispatch => ({
    removeToast: () => dispatch(removeToast()),
  })
)
class Notifications extends PureComponent {
  static propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })).isRequired,
    removeToast: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.onDismiss = this.onDismiss.bind(this)
  }

  onDismiss() {
    this.props.removeToast()
  }

  render() {
    const { toasts } = this.props
    const toast = toasts[0]
    return (
      <Snackbar
        toasts={toast ? [toast] : []}
        autohideTimeout={3000}
        className={toast ? `toast toast_${toast.type}` : ''}
        autohide
        onDismiss={this.onDismiss}
      />
    )
  }
}

export default Notifications
