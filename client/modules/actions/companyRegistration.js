//le funzioni receive...
import request from 'superagent'
import {push} from 'react-router-redux'
import {userRegistration} from './userRegistration'

function requestCheckCompanyName() {
	return {
		type: 'waiting',
		operation: 'checkCompanyName'
	}
}

function receiveCheckCompanyName(bool, step) {
	if(bool){
	  if(step > 0)
			return { type: 'failedCheckUsername'}
		else
			return { type: 'failedcheckCompanyName' }
	}
	else
		return { type: 'checkCompanyName' }
}

export function checkCompanyName(data) {
	return function(dispatch){
		dispatch(requestCheckCompanyName())
		return request
			.head('http://www.zinoo.it:3000/api/companies/'+data.companyName)
			.then(
				function(){
					dispatch(receiveCheckCompanyName(true), 0)
				},
				function(){
					return request
						.head('http://www.zinoo.it:3000/api/accounts/'+data.ownerMail)
						.then(
							function(res){
								dispatch(receiveCheckCompanyName(true), 1)
							},
							function(){
								dispatch(receiveCheckCompanyName(false), 2)
								dispatch(companyRegistration(data))
							}
						)
				}
			)
	}
}

function requestCompanyRegistration() {
	return {
		type: 'waiting',
		operation: 'companyRegistration'
	}
}

function receiveCompanyRegistration(bool, text) {
	if(bool) return {
		type: 'companyRegistration'
		}
	else return {
		type: 'error',
		error: text
		}
}

export function companyRegistration(data) {
	return function(dispatch){
		dispatch(requestCompanyRegistration())
		return request
			.post('http://www.zinoo.it:3000/api/companies')
			.send({
				organization: data.companyName,
				ownerId: data.ownerMail,
				subscribedAt: Date()
			})
			.then(function() {
					dispatch(receiveCompanyRegistration(true))
					dispatch(userRegistration(data, 3))
				},
				function(err){
					dispatch(receiveCompanyRegistration(false, err))
				}
			)
	}
}
