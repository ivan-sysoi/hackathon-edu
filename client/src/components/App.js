import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Helmet from 'react-helmet'

import {
  CoursesAddPage,
  CoursesListPage,
  CoursesItemPage,
} from 'components'

import { isBrowser } from 'config'


if (isBrowser) {
  require('./styles.scss')
}

const App = () => {
  return [
    <Helmet titleTemplate="%s" key="Helmet">
      <title>Главная</title>
      <meta name="description" content="EduChain"/>
      <link rel="manifest" href="/manifest.json"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
      <meta charset="utf-8"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <body className="app"/>
    </Helmet>,
    <Switch key="Switch">
      <Route path="/" exact component={CoursesListPage} strict/>
      <Route path="/courses/add" exact component={CoursesAddPage} strict/>
      <Route path="/course/" component={CoursesItemPage} />

      {/*<Route component={NotFound}/>*/}
    </Switch>,
  ]
}

export default App
