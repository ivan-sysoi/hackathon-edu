import React from 'react'
import PropTypes from 'prop-types'

import { Helmet } from 'react-helmet'


const MinimalTemplate = (props) => {
  const minimalStyles = `
      @import url('https://fonts.googleapis.com/css?family=Roboto');
      html, body {
        margin: 0;
        padding: 0;
        background-color: #fafafa;
        font-family:Roboto,sans-serif;
        font-weight:400;
        -moz-osx-font-smoothing:grayscale;
        -webkit-font-smoothing:antialiased;
        text-rendering:optimizeLegibility;
      }
      h1 {
        font-size:112px;
        font-weight:300;
        line-height:128px;
        color: rgba(0, 0, 0, 0.5);
      }
      h2 {
        margin: 0;
        font-weight: 400;
        font-size:34px;
        line-height:72px;
        color: rgba(0, 0, 0, 0.5);
      }
      .main-container{
        width: 100% !important;
        position:absolute !important;
        left:0 !important;
        text-align:center !important;
        padding: 20px !important;
        color: #000 !important;
       }
      @media (max-width: 450px) {
        h1 {
          font-size:50px !important;
          line-height:60px !important;
         }
        h2 {
          font-size:18px !important;
          line-height:36px !important;
         }
      }
      @media (max-height: 450px) {
        h1 {
          font-size:50px !important;
          line-height:60px !important;
         }
        h2 {
          font-size:18px !important;
          line-height:36px !important;
         }
      }`
  return (
    <div>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>
      <style type="text/css" dangerouslySetInnerHTML={{ __html: minimalStyles }}
      />
      <main
        className="main-container"
      >
        {props.children}
      </main>
    </div>
  )
}

MinimalTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
}

MinimalTemplate.defaultProps = {}

export default MinimalTemplate
