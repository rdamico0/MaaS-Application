import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class MLink extends Component {

  render() {
    return (
      <Link {...this.props} rel="stylesheet" type="text/css" activeClassName="active"/>
    )
  }
}

MLink.contextTypes = {
  store : React.PropTypes.object
}

export default MLink
