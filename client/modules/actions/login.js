import request from 'superagent'
import {push} from 'react-router-redux'
import {getDSLIList} from './getDSLIList'

function requestLogin() {
	return {
		type: 'waiting',
		operation: 'login'
	}
}

function receiveLogin(bool, data) {
	if(bool) return {
		type: 'login',
		user: data
	}
	else return {
		type: 'failedLogin',
		error: data
	}
}

export function login(json) {
	return function(dispatch){
		dispatch(requestLogin())
		return request
			.post('http://www.zinoo.it:3000/api/accounts/login?include=user')
			.send({
				email: json.mail,
				password: json.pwd
			})
			.then(
				function(result){
					let res = JSON.parse(result.text);
					dispatch(receiveLogin(true, {
						username: res.userId,
						accessLevel: res.user.dutyId,
						token: res.id,
						company: res.user.companyId,
						DSLIList: null
					}))
					dispatch(getDSLIList()).then(() => (dispatch(push('/home'))))
				},
				function(error){
					dispatch(receiveLogin(false, error))
				})
	}
}
