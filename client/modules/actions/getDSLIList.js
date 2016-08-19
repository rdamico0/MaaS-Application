import request from 'superagent'

function requestDSLIList() {
	return {
		type: 'waiting',
		operation: 'getDSLIList'
	}
}

function receiveDSLIList(bool, data) {
	if(bool) return {
		type: 'getDSLIList',
		listDSLI: data //lista
	}
	else return {
		type: 'error',
		error: data
	}
}

export function getDSLIList() {
	return function(dispatch, getState){
		dispatch(requestDSLIList())
		return request
			.get('http://www.zinoo.it:3000/api/companies/'+getState().loggedUser.company+'/dsls?access_token='+getState().loggedUser.token)
			.then(
				function(result){
					let res = JSON.parse(result.text)
					dispatch(receiveDSLIList(true, res))
				},
				function(error){
					dispatch(receiveDSLIList(false, error))
				}
			)
	}
}
