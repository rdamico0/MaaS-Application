import React, { Component, PropTypes } from 'react'
import MTextBox from '../components/MTextBox'
import * as actions from '../actions/RootAction'
import { routerMiddleware, push } from 'react-router-redux'

class NewDSLI extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
  }

  render() {
    const { store } = this.context
    return (
  	  <div>
        <h2>Create DSLI</h2>
        NomeDSLI <MTextBox
          boxType="text"
          onWrite={(event) => {
            this.name = event.target.value
          }}
        />
        {this.warn}

        <button
          type = "button"
          onClick = {() => {
            store.dispatch(actions.newDSLI({name:this.name, code:"Insert your DSL code here!"}))
          }}>
          CREATE
        </button>
      </div>
  	)
  }
}

NewDSLI.contextTypes = {
  store : React.PropTypes.object
}

export default NewDSLI
