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
        <td>{this.props.user.proprietario}</td>
        <td>{this.props.user.nome}</td>
        <td><MButton label = "X"
          onClick = {() => {
            store.dispatch(actions.deleteUser(this.props.user.id))
        }}/></td>
        <td><select name="example">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select></td>
      </tr>
    )
  }
}

MUserRow.contextTypes = {
  store : React.PropTypes.object
}

export default MUserRow
