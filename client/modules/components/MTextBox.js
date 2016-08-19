import React, { Component, PropTypes } from 'react'

class MTextBox extends Component {

  render() {
    return (
      <input type={this.props.boxType} onChange={this.props.onWrite} defaultValue={this.props.value}/>
    )
  }
}

MTextBox.contextTypes = {
  store : React.PropTypes.object
}

export default MTextBox
