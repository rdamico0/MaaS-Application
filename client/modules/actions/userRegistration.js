import request from 'superagent'
import {push} from 'react-router-redux'

export function requestCheckUsername() {
	return {
		type: 'waiting',
	 	operation: 'checkUsername'
	}
}

export function receiveCheckUsername(bool) {
	if(bool) return { type: 'successCheckUsername' }
	else return { type: 'failedCheckUsername' }
}

export function checkUsername(username) {
	return function(dispatch) {
		dispatch(requestCheckUsername())
		request
			.head('http://www.zinoo.it:3000/api/accounts/'+username)
			.then(
				function(res){
					dispatch(receiveCheckUsername(true))
				},
				function(){
					dispatch(receiveCheckUsername(false))
					dispatch(companyRegistration(username))
				}
			)
	}
}

export function requestUserRegistration() {
	return {
		type: 'waiting',
		operation: 'userRegistration'
 }
}

export function receiveUserRegistration(bool, data) {
	if(bool) return {
		type: 'userRegistration',
		user: data
	}
	else return {
		type: 'error',
		error: data
		}
}

export function userRegistration(data, role) {
	return function(dispatch){
		dispatch(requestUserRegistration())
		console.log(data);
		return request
			.post('http://www.zinoo.it:3000/api/companies/'+data.companyName+'/users')
			.send({
				email: data.ownerMail,
				password: "asd",
				realm: data.companyName,
				companyId: data.companyName,
				dutyId: role,
				subscribedAt: Date(),
				emailVerified: false
			})
			.then(function(result) {
					dispatch(receiveUserRegistration(true, result))
					dispatch(push('/'))
				},
				function(err){
					dispatch(receiveUserRegistration(false, err))
				}
			)
	}
}
