import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import MTextBox from '../components/MTextBox'
import * as actions from '../actions/RootAction'
import { routerMiddleware, push } from 'react-router-redux'

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
    this.dialog = false
  }

  render() {
    const { store } = this.context

    if(store.getState().status.validity != undefined && store.getState().status.validity.username == true)
      this.dialog = true

    return (
  	  <div>
        <h2>SignIn</h2>
        NOME AZIENDA <MTextBox
          boxType="text"
          onWrite={(event) => {
            this.name = event.target.value
          }}
        />
        PROPRIETARIO <MTextBox
          boxType="text"
          onWrite={(event) => {
            this.owner = event.target.value
          }}
        />
        {this.warn}

        <button
          type = "button"
          onClick = {() => {
            let data = {
              companyName: this.name,
              ownerMail: this.owner
            }
            store.dispatch(actions.checkCompanyName(data))
          }}>
          SIGN IN
        </button>

        <Modal isOpen= {this.dialog}>
          <h2>Company registered! Check your e-mail to login!</h2>
          <button
            type = "button"
            onClick = {() => {
              this.dialog = false
              store.dispatch(actions.redirect('/'))
          }}>
          OK
          </button>
        </Modal>
      </div>
  	)
  }
}

SignIn.contextTypes = {
  store : React.PropTypes.object
}

export default SignIn
