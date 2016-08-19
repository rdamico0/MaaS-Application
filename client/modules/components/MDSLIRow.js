import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import MButton from './MButton'
import MLink from './MLink'

class MDSLIRow extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { store } = this.context
    let admin = (<td></td>)
    if(this.props.showPermits)
      admin = (<td><MButton label = "X"
                  onClick = {() => {
                    store.dispatch(actions.deleteDSLI(this.props.data.id))
                }}/></td>)
    return (
      <tr>
        <td>{this.props.data.id}</td>
        <td><MLink to="/execdsli">{this.props.data.name}</MLink ></td>
        <td>{this.props.data.lastModifiedDate}</td>
        <td><MButton label = "Edit"
          onClick = {() => {
            store.dispatch(actions.setDSLI(this.props.data))
            store.dispatch(actions.redirect("/editdsli"))
        }}/></td>
        {admin}
      </tr>
    )
  }
}

MDSLIRow.contextTypes = {
  store : React.PropTypes.object
}

export default MDSLIRow
