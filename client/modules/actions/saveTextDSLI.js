import request from 'superagent'

function requestSaveTextDSLI() {
	return {
		type: 'waiting',
		operation: 'saveTextDSLI'
	}
}

function receiveSaveTextDSLI(bool, text) {
	if(bool) return {
		type: 'saveTextDSLI',
		newText: text
	}
	else return {
		type: 'error',
		error: text
		}
}

export function saveTextDSLI(dsli) {
	return function(dispatch, getState){
		dispatch(requestSaveTextDSLI())
		console.log(dsli)
		return request
			.put('http://www.zinoo.it:3000/api/companies/'+ getState().loggedUser.company + '/dsls/' + dsli.id + '?access_token=' + getState().loggedUser.token)
			.send({
				name: dsli.name,
				code: dsli.code,
				lastModifiedDate: Date(),
				databseId: dsli.db
			})
			.then(function() {
					dispatch(receiveSaveTextDSLI(true, dsli)) //il reducer deve modificare state.currentDSLI.DSLI
				},
				function(err){
					dispatch(receiveSaveTextDSLI(false, err))
				}
			)
	}
}
