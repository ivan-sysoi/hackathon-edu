import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-md/lib/Buttons/Button'
import Card from 'react-md/lib/Cards/Card'
import CardTitle from 'react-md/lib/Cards/CardTitle'
import CardText from 'react-md/lib/Cards/CardText'
import CardActions from 'react-md/lib/Cards/CardActions'
import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import TablePagination from 'react-md/lib/DataTables/TablePagination'
import { connect } from 'react-redux'
import golos from 'golos-js'
import { Link } from 'react-router-dom'

import { isBrowser } from 'config'
import { selectCourses, selectUser } from 'store/selectors'
import { PageTemplate } from 'components'


if (isBrowser) {
  require('./styles.scss')
  window.golos = golos
}

@connect(
  state => ({
    user: selectUser(state),
  })
)
class CoursesListPage extends PureComponent {
  static propTypes = {}

  static defaultProps = {
  }

  constructor(props) {
    super(props)

    this.state = {
      posts: [],
    }
  }

  componentWillMount() {
    golos.api.getState('@' + this.props.user.username, (err, result) => {
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
    //go
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
          >
            <TableHeader>
            <TableRow>
            <TableColumn>Название</TableColumn>
            <TableColumn>Дата</TableColumn>
            </TableRow>
            </TableHeader>
            <TableBody>
              {this.state.posts.map((course, i) => (
                <TableRow
                  key={course.id}
                >
                  <TableColumn
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
