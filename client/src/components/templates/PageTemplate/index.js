import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import Button from 'react-md/lib/Buttons/Button'
import { Link } from 'react-router-dom'

import { Footer, Notifications, Toolbar } from 'components'
import {
  selectIsMobileMedia,
} from 'store/selectors'
import { toggleDrawer } from 'store/actions'
import { isBrowser } from 'config'


if (isBrowser) {
  require('./styles.scss')
}

//@connect(
//
//)
class PageTemplate extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
    pageDescription: PropTypes.string,
    pageKeywords: PropTypes.arrayOf(PropTypes.string),
    pageImage: PropTypes.string,
    toolbar: PropTypes.element,
    contentClassName: PropTypes.string,
  }
  static defaultProps = {
    pageDescription: null,
    toolbar: null,
    pageKeywords: null,
    pageImage: null,
    contentClassName: '',
  }

  render() {
    //console.log('PageTemplate render')
    const { customer, title, pageImage } = this.props
    //console.log('PageTemplate render: ', this.props.drawer)
    //const hasSecondToolbar = this.props.toolbar !== null
    let toolbar
    if (this.props.toolbar !== null) {
      toolbar = this.props.toolbar
    } else {
      toolbar = (
        <Toolbar
          title={this.props.title}
        />
      )
    }
    return (
      <div>
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>

        <div
          className={`${this.props.drawerVisible && this.props.drawer ? 'md-drawer-relative' : ''}`}
        >
          {toolbar}

          <main
            className={`main-container md-toolbar-relative`}
          >

            <div
              className={`${this.props.contentClassName}`}
            >
              {this.props.children}
            </div>

          </main>

          <Footer/>
        </div>
        <Notifications/>
      </div>
    )
  }
}

export default PageTemplate
