export function requestChangeAccessLevel() {
	return {
		type: 'waiting',
		operation: 'changeAccessLevel'
	}
}

export function receiveChangeAccessLevel(bool, data) {
	if(bool) return {
		type: 'changeAccessLevel',
		newLevel: data
	}
	else return {
		type: 'error',
		error: data
		}
}

export function changeAccessLevel(newLevel) { //newPermits is an array
	return function(dispatch){
		dispatch(requestChangeDSLIPermits())
		return request
			.put('url1')
			.send({
				accessLevel: newLevel
			})
			.then(function() {
					dispatch(receiveChangeAccessLevel(true, newLevel))
				},
				function(error){
					dispatch(receiveChangeAccessLevel(false, error))
				}
			)
	}
}
