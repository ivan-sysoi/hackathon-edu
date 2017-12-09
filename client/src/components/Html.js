/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

const Html = ({ assets, state, content }) => {
  const helmet = Helmet.renderStatic()
  const htmlAttrs = helmet.htmlAttributes.toComponent()
  const bodyAttrs = helmet.bodyAttributes.toComponent()

  return (
    <html lang="ru" {...htmlAttrs}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {assets.css.map(path => <link rel="stylesheet" type="text/css" key={path} href={path} />)}
      </head>
      <body {...bodyAttrs}>
        <span id="app" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{ __html: state }} />
        {assets.js.map(path => <script key={path} src={path} />)}
        {/*{helmet.script.toComponent()}*/}
      </body>
    </html>
  )
}

Html.propTypes = {
  assets: PropTypes.shape({
    css: PropTypes.array.isRequired,
    js: PropTypes.array.isRequired,
  }).isRequired,
  state: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}

export default Html
