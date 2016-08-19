import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'
import Components from '../components'
const {MTextBox, MButton} = Components
import Modal from 'react-modal'

class Editor extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
    this.name = "SampleDSLI"
    this.dialog = false
  }

  render() {
    const { store } = this.context
    let dsli = store.getState().currentDSLI

    return (
  	  <div>
        <div>
          <h2>{dsli.name}</h2>
          <MButton label = "RENAME"
              onClick = {() => {
                this.dialog = true
                store.dispatch(actions.refresh())
          }}/>
        </div>
        <textarea rows="20" cols="20" defaultValue = {dsli.code}
        onChange={(event) => {
          dsli.code = event.target.value
          console.log(dsli.code)
        }} />

        <div>
          <MButton label = "SAVE"
            onClick = {() => {
              store.dispatch(actions.saveTextDSLI(dsli))
          }}/>
          <MButton label = "DELETE"
            onClick = {() => {
              store.dispatch(actions.deleteDSLI(dsli.id))
          }}/>
          <MButton label = "CLONE"
            onClick = {() => {
              store.dispatch(actions.cloneDSLI(dsli))
          }}/>
        </div>

        {this.warn}

        <Modal isOpen= {this.dialog}>
          <h2>Insert new Name for this DSLI</h2>
          NEW NAME <MTextBox
            boxType="text"
            value={dsli.name}
            onWrite={(event) => {
              this.tempname = event.target.value
            }}
          />
          <MButton label = "OK"
            onClick = {() => {
              if(this.tempname)
                dsli.name = this.tempname
              this.dialog = false
              store.dispatch(actions.refresh())
              //store.dispatch(actions.redirect('/home'))
          }}/>
          <MButton label = "CANCEL"
            onClick = {() => {
              this.dialog = false
              store.dispatch(actions.refresh())
              //store.dispatch(actions.redirect('/home'))
          }}/>
        </Modal>

      </div>
  	)
  }
}

Editor.contextTypes = {
  store : React.PropTypes.object
}

export default Editor
