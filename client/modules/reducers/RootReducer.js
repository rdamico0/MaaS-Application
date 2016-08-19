import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import loggedUserReducer from './loggedUser'
import DSLIListReducer from './DSLIList'
import userListReducer from './userList'
import dataListReducer from './dataList'
import currentDSLIReducer from './currentDSLI'
import currentUserReducer from './currentUser'
import statusReducer from './statusReducer'

export default combineReducers({
	loggedUser: loggedUserReducer,
	DSLIList: DSLIListReducer,
	userList: userListReducer,
	dataList: dataListReducer,
	currentDSLI: currentDSLIReducer,
	currentUser: currentUserReducer,
	status: statusReducer,
		companies : companiesReducer,
		auth : authReducer,
		sys : systemReducer,
		routing: routerReducer,
		profile: infoReducer,
	})

export default function authReducer(state = 0, action) {
	switch (action.type) {
    case 'AT':
      return 1
		case 'AL':
		  return 0
    default:
      return state
  }
}

export default function systemReducer(state = '', action) {
	switch (action.type) {
    case 'ERR':
      return action.err
    default:
      return ''
  }
}

export default function infoReducer(state = '', action) {
		switch (action.type) {
	    case 'REQUESTED_PROFILE':
	      return action.value
	    default:
	      return state
	  }
}

export default function companiesReducer(state = 0, action) {
	switch (action.type) {
    case 'RECEIVED_COMPANIES':
      return action.companies
    default:
      return state
  }
}
