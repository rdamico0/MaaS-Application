import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import Modal from 'react-modal'
import Components from '../components'
const {MTextBox, MButton, MUserRow} = Components

class MnUser extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
    this.dialog = false
  }

  render() {
    const { store } = this.context
    let comp = JSON.parse(store.getState().companies)

    let body = []
    let i
    let n = comp.length;
    for (i = 0; i < n; i++) {
      body[i] = <MUserRow user = {comp[i]}/>
    }
    return (
  	  <div>
        <h2>User Managment</h2>
        <table>
        <tbody>
          {body}
        </tbody>
        </table>
        EMAIL <MTextBox
          boxType="text"
          onWrite={(event) => {
            this.user = event.target.value
          }}
        />
        <button
          type = "button"
          onClick = {() => {
            this.dialog = true
            store.dispatch(actions.refresh())
            //store.dispatch(actions.redirect('/home'))
        }}>
        SEND INVITE
        </button>
        <Modal isOpen= {this.dialog}>
          <h2>Do you really want to delete this useless person?</h2>
          <button
            type = "button"
            onClick = {() => {
              this.dialog = false
              store.dispatch(actions.refresh())
              //store.dispatch(actions.redirect('/home'))
          }}>
          YES
          </button>
          <button
            type = "button"
            onClick = {() => {
              this.dialog = false
              store.dispatch(actions.refresh())
              //store.dispatch(actions.redirect('/home'))
          }}>
          NO
          </button>
        </Modal>
        {this.warn}
      </div>
  	)
  }
}

MnUser.contextTypes = {
  store : React.PropTypes.object
}

export default MnUser
