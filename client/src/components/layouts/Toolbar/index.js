import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import LinearProgress from 'react-md/lib/Progress/LinearProgress'
import ReactMdToolbar from 'react-md/lib/Toolbars'
import Button from 'react-md/lib/Buttons/Button'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { OneSelectWidget } from 'components'
import { selectCurrentUser, selectUserByUserName, selectUsers } from 'store/selectors'
import { setCurrentUser } from 'store/actions'

import { isBrowser } from 'config'

if (isBrowser) {
  require('./styles.scss')
}

@connect(
  state => ({
    currentUser: selectCurrentUser(state),
    selectUserByUserName: userName => selectUserByUserName(state, userName),
    allUsers: selectUsers(state),
  }),
  dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user)),
  })
)
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

  constructor(props) {
    super(props)
    this.onUserRoleChange = this.onUserRoleChange.bind(this)
  }

  onUserRoleChange(userName) {
    const user = this.props.selectUserByUserName(userName)
    console.log(user)
    if (user) {
      this.props.setCurrentUser(user)
    }
  }

  render() {
    const results = [
      <ReactMdToolbar
        key="toolbar"
        fixed
        //colored
        zDepth={1}
        className={`toolbar `}
        title={this.props.title}
      >

        <div
          className="toolbar__right-btns"
        >
          <Link
            to="/"
          >
            <Button
              flat
              primary
              type="submit"
            >
              All courses
            </Button>
          </Link>

          {this.props.currentUser.role === 'teacher' && (
            <Link
              to="/courses/add"
            >
              <Button
                flat
                primary
                type="submit"
              >
                Create course
              </Button>
            </Link>
          )}

          <OneSelectWidget
            className="toolbar__user"
            value={this.props.currentUser.username}
            onChange={this.onUserRoleChange}
            options={{
              _fullWidth: false,
              enumOptions: this.props.allUsers.map(u => ({ value: u.username, label: u.role })),
            }}
          />
        </div>
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
