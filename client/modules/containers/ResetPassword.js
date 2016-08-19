import React, { Component, PropTypes } from 'react'
import MTextBox from '../components/MTextBox'
import * as actions from '../actions/RootAction'
import { routerMiddleware, push } from 'react-router-redux'

class RePwd extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
  }

  render() {
    const { store } = this.context
    return (
  	  <div>
        <h2>ResetPassword</h2>
        Password <MTextBox
          boxType="password"
          onWrite={(event) => {
            this.op = event.target.value
          }}
        />
        Nuova Password <MTextBox
          boxType="password"
          onWrite={(event) => {
            this.p1 = event.target.value
          }}
        />
        Ripeti Password <MTextBox
          boxType="password"
          onWrite={(event) => {
            this.p2 = event.target.value
          }}
        />
        {this.warn}

        <button
          type = "button"
          onClick = {() => {
            if(this.p1 == this.p2)
              store.dispatch(actions.redirect('/'))
            else{
              console.log(this.p1);
              console.log(this.p2);
              this.warn = "Le password non coincidono!";
              store.dispatch(actions.refresh())
            }
          }}>
          CHANGE PASSWORD
        </button>
      </div>
  	)
  }
}

RePwd.contextTypes = {
  store : React.PropTypes.object
}

export default RePwd
