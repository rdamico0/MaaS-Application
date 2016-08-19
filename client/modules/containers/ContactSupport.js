import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import Components from '../components'
const {MTextBox, MButton} = Components

class ContactSupport extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
  }

  render() {
    const { store } = this.context
    return (
  	  <div>
        <h2>LogIn</h2>
        EMAIL <MTextBox
          boxType="text"
          onWrite={(event) => {
            this.user = event.target.value
          }}
        />
        {this.warn}
        <div>
          <textarea rows="20" cols="20">

          </textarea>
        </div>
        <MButton label = "INVIA"
          onClick = {() => {
            store.dispatch(actions.changePassword('prova'))
        }}/>
      </div>
  	)
  }
}

ContactSupport.contextTypes = {
  store : React.PropTypes.object
}

export default ContactSupport
