import request from 'superagent'

function requestDeleteData() {
	return {
		type: 'waiting',
		operation: 'deleteData'
	}
}

function receiveDeleteData(bool, text) {
	if(bool) return {
		type: 'deleteData',
		id: text
	}
	else return {
		type: 'error',
		error: text
	}
}

export function deleteData(dataId) {
	return function(dispatch, getState){
		dispatch(requestDeleteData())
		return request
			.del('http://www.zinoo.it:3000/api/companies/'+getState().loggedUser.company+'/databases/'+dataId+'?access_token='+getState().loggedUser.token)
			.then(
				function(){
					dispatch(receiveDeleteData(true), dataId)

				},
				function(error){
					dispatch(receiveDeleteData(false, error))
				}
			)
	}
}
