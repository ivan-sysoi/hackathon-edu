import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


import { isBrowser } from 'config'

if (isBrowser) {
  require('./styles.scss')
}


class Footer extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const { className } = this.props
    return (
      <footer className={`footer ${className}`}>
        <div
          className="footer__copy"
        >
          Copyright {(new Date()).getFullYear()} Profichain
        </div>
      </footer>
    )
  }
}

export default Footer
