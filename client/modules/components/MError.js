import React, { Component, PropTypes } from 'react'

class MError extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { store } = this.context
    const value = store.getState().sys;
    return (
      <p>
        {value}
      </p>
    )
  }
}

MError.contextTypes = {
  store : React.PropTypes.object
}

export default MError
