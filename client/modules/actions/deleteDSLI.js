import request from 'superagent'

function requestDeleteDSLI() {
	return {
		type: 'waiting',
		operation: 'deleteDSLI'
	}
}

function receiveDeleteDSLI(bool, text) {
	if(bool) return { type: 'deleteDSLI' }
	else return {
		type: 'error',
		error: text
	}
}

export function deleteDSLI(dsliId) {
	return function(dispatch, getState){
		dispatch(requestDeleteDSLI())
		return request
			.del('http://www.zinoo.it:3000/api/companies/'+ getState().loggedUser.company + '/dsls/' + dsliId + '?access_token=' + getState().loggedUser.token)
			.then(
				function(){
					dispatch(receiveDeleteDSLI(true))
				},
				function(error){
					dispatch(receiveDeleteDSLI(false, error))
				}
			)
	}
}
