import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import MButton from './MButton'

class MUserRow extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { store } = this.context
    return (
      <tr>
        <td>{this.props.data.id}</td>
        <td>{this.props.data.uri}</td>
        <td><MButton label = "X"
          onClick = {() => {
            store.dispatch(actions.deleteData(this.props.data.id))
        }}/></td>
      </tr>
    )
  }
}

MUserRow.contextTypes = {
  store : React.PropTypes.object
}

export default MUserRow
