import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LinearProgress from 'react-md/lib/Progress/LinearProgress'
import ReactMdToolbar from 'react-md/lib/Toolbars'

import { isBrowser } from 'config'

if (isBrowser) {
  require('./styles.scss')
}

class Toolbar extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.element),
  }

  static defaultProps = {
    className: '',
    items: [],
    loading: false,
  }

  render() {
    //console.log('Toolbar: ', this.props)
    const results = [
      <ReactMdToolbar
        key="toolbar"
        fixed
        zDepth={1}
        className={`toolbar `}
        title={this.props.title}
      >
        {/*{this.logo}*/}
        {/*{this.props.hasDrawer && this.filtersSwitch}*/}
        {this.props.items.map(i => i)}
        {/*{this.props.user !== null ? this.userMenu : this.loginButton}*/}
      </ReactMdToolbar>,
    ]
    if (this.props.loading) {
      results.push(
        (
          <LinearProgress
            key="progress"
            id="progress-id"
            className={`toolbar__progress`}
          />
        ),
      )
    }
    return results
  }
}

export default Toolbar
