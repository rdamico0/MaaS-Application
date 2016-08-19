import React, { Component, PropTypes } from 'react'
import MTextBox from '../components/MTextBox'
import * as actions from '../actions/RootAction'

class ReAcc extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
  }

  render() {
    const { store } = this.context
    return (
  	  <div>
        <h2>RecoverAccount</h2>
        EMAIL <MTextBox
          boxType="text"
          onWrite={(event) => {
            this.user = event.target.value
          }}
        />
        {this.warn}

        <button
          type = "button"
          onClick = {() => {
            store.dispatch(actions.emailResetPassword(store, this.name, this.owner))
          }}>
          SEND EMAIL
        </button>
      </div>
  	)
  }
}

ReAcc.contextTypes = {
  store : React.PropTypes.object
}

export default ReAcc
