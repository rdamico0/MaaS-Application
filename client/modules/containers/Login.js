import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import Components from '../components'
const {MTextBox, MButton, MLink} = Components

class LogIn extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
  }

  render() {
    const { store } = this.context
    return (
  	  <div>
        <h2>LogIn</h2>
        <div>
        TUA EMAIL <MTextBox
          boxType="text"
          value = "bertosinriccardo@gmail.com"
          onWrite={(event) => {
            this.mail = event.target.value
          }}
        />
        </div>
        <div>
        PASSWORD <MTextBox
          boxType="password"
          value = "asd"
          onWrite={(event) => {
            this.pwd = event.target.value
          }}
        />
        </div>

        {this.warn}

        <MButton label = "LOG IN"
          onClick = {() => {
            store.dispatch(actions.login({mail:this.mail, pwd:this.pwd}))
        }}/>
        <MLink to="/login/reacc">Password Dimenticata?</MLink >
      </div>
  	)
  }
}

LogIn.contextTypes = {
  store : React.PropTypes.object
}

export default LogIn
