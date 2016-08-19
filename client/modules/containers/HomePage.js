import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import Components from '../components'
const {MButton, MDSLIRow} = Components

class Dashboard extends Component {

  render() {
    const {store} = this.context
    let comp = store.getState().DSLIList

    let body = []
    let i
    let n = comp.length;
    for (i = 0; i < n; i++) {
      body[i] = <MDSLIRow data = {comp[i]} showPermits = {false}/>
    }
    return (
	  <div>
        <h2>Welcome to Your Dashboard</h2>
        <MButton label = "CREATE DSLI"
          onClick = {() => {
            store.dispatch(actions.redirect('/newdsli'))
        }}/>
        <MButton label = "REFRESH"
          onClick = {() => {
            store.dispatch(actions.getDSLIList())
        }}/>
      <table>
      <tbody>
        {body}
      </tbody>
      </table>

      {this.warn}
    </div>
  	)
  }
}

Dashboard.contextTypes = {
  store : React.PropTypes.object
}

export default Dashboard
