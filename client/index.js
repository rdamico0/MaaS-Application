import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

import Header from './modules/containers/Header'
import Login from './modules/containers/Login'
import SignIn from './modules/containers/SignIn'
import ReAcc from './modules/containers/RecoverAccount'
import RePwd from './modules/containers/RecoverPassword'
import ChangePwd from './modules/containers/ResetPassword'
import Contact from './modules/containers/ContactSupport'
import Profile from './modules/containers/Profile'
import NewDSLI from './modules/containers/NewDSLI'
import EditDSLI from './modules/containers/Editor'
import MainPage from './modules/containers/MainPage'
import HomePage from './modules/containers/HomePage'
import MnUser from './modules/containers/UserManagement'
import MnDSLI from './modules/containers/DSLIManagement'
import MnData from './modules/containers/DataManagement'
import Provider from './modules/containers/Provider'

import PageBuilder from './modules/services/PageBuilder'
import rootReducer from './modules/reducers/RootReducer'

import createLogger from 'redux-logger'

import thunk from 'redux-thunk'

const goto = routerMiddleware(browserHistory)
const logger = createLogger()
const store = createStore(
		rootReducer,
		applyMiddleware(goto, logger, thunk)
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

const rootEl = document.getElementById('app')

const routes =
	<Route path="/" component={Header}>
		<IndexRoute component={MainPage}/>
		<Route path="/home" component={HomePage}/>
		<Route path="/signIn" component={SignIn}/>
		<Route path="/login" component={Login}/>
		<Route path="/login/reacc" component={ReAcc}/>
		<Route path="/login/repwd" component={RePwd}/>
		<Route path="/profile" component={Profile}/>
		<Route path="/support" component={Contact}/>
		<Route path="/newdsli" component={NewDSLI}/>
		<Route path="/manageuser" component={MnUser}/>
		<Route path="/managedsli" component={MnDSLI}/>
		<Route path="/managedata" component={MnData}/>
		<Route path="/editdsli" component={EditDSLI}/>
		<Route path="/execdsli" component={PageBuilder}/>
		<Route path="/profile/changepwd" component={ChangePwd}/>
	</Route>;

function render() {
	ReactDOM.render(
		<Provider store = {store}>
			<Router history={history}>
				{routes}
			</Router>
		</Provider>,
		rootEl
  )
}

render()
store.subscribe(render)
