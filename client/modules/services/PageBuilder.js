import React, { Component, PropTypes } from 'react'
import * as actions from '../actions/RootAction'

class PageBuilder extends Component {
  constructor(props) {
    super(props)
    this.warn = ""
    //this.qualcosa crea una variabile resistente alle chiamate di render
  }

  render() {
    const { store } = this.context
    let dsli = store.getState().currentDSLI
    //ogni action risolta si passa da qui
    return (
  	  <div>
        Loading...
      </div>
  	)
  }
}

PageBuilder.contextTypes = {
  store : React.PropTypes.object
}

export default PageBuilder
