import request from 'superagent'

function requestAddDatabase() {
	return {
		type: 'waiting',
		operation: 'addDatabase'
	}
}

function receiveAddDatabase(bool, data) {
	if(bool) return {
		type: 'addDatabase'
		}
	else return {
		type: 'error',
		error: data
		}
}

export function addDatabase(data) {
	return function(dispatch, getState){
		dispatch(requestAddDatabase())
		return request
		  .post('http://www.zinoo.it:3000/api/companies/'+getState().loggedUser.company+'/databases?access_token='+getState().loggedUser.token)
			.send({
				uri: data
			})
			.then(function() {
					dispatch(receiveAddDatabase(true))
				},
				function(err){
					dispatch(receiveAddDatabase(false, err))
				}
			)
	}
}
