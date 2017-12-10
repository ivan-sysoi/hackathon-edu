import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Card from 'react-md/lib/Cards/Card'
import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from 'react-md/lib/Buttons/Button'

import golos from 'services/golos'
import { isBrowser } from 'config'
import { selectTeacherUser } from 'store/selectors'
import { PageTemplate } from 'components'


if (isBrowser) {
  require('./styles.scss')
  window.golos = golos
}

@connect(
  state => ({
    teacher: selectTeacherUser(state),
  })
)
class CoursesListPage extends PureComponent {
  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)

    this.state = {
      posts: [],
    }
  }

  componentWillMount() {
    golos.api.getState('@' + this.props.teacher.username, (err, result) => {
      //console.log('getState', err, result)
      if (result && result.content) {
        this.setState((prevState) => {
          const posts = Object.values(result.content)
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .map(item => ({
              id: item.id,
              created: item.created,
              title: item.title,
              url: item.url,
            }))
          return {
            ...prevState,
            posts,
          }
        })
      }
    })
  }

  render() {
    return (
      <PageTemplate
        title="Все курсы"
      >
        <Card>
          <DataTable
            baseId="coursesTable"
            plain
            className="courses-table"
          >
            <TableHeader>
              <TableRow>
                <TableColumn>Title</TableColumn>
                <TableColumn>Created</TableColumn>
                <TableColumn></TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {this.state.posts.map((course, i) => (
                <TableRow
                  key={course.id}
                >
                  <TableColumn
                    className="courses-table__title"
                  >
                    <Link
                      to={`/course${course.url}`}
                    >
                      {course.title}
                    </Link>
                  </TableColumn>
                  <TableColumn
                  >
                    {course.created}
                  </TableColumn>
                  <TableColumn
                  >
                    <Link
                      to={`/course${course.url}`}
                    >
                      <Button
                        icon
                        primary
                      >
                        chevron_right
                      </Button>
                    </Link>

                  </TableColumn>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Card>

      </PageTemplate>
    )
  }
}

export default CoursesListPage
