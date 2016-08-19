function requestDSLI() {
	return {
		type: 'waiting',
		operation: 'getDSLI'
	}
}

function receiveDSLI(bool, data) {
	if(bool) return {
		type: 'getDSLI',
		selected: data
	}
	else return {
		type: 'error',
		error: data
	}
}


export function getDSLI() {
	return function(dispatch){
		dispatch(requestDSLI())
		return request
			.get('url1')
			.then(
				function(result){
					dispatch(receiveDSLI(true, result))
				},
				function(error){
					dispatch(receiveDSLI(false, error))
				}
			)
	}
}
