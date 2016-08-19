export function requestChangeDSLIPermits() {
	return {
		type: 'waiting',
		operation: 'changeDSLIPermits'
	}
}

export function receiveChangeDSLIPermits(bool, data) {
	if(bool) return {
		type: 'changeDSLIPermits',
		newPermits: data
	}
	else return {
		type: 'error',
		error: data
		}
}

export function changeDSLIPermits(newPermits) { //newPermits is an array
	return function(dispatch){
		dispatch(requestChangeDSLIPermits())
		return request
			.put('url1')
			.send({
				permits: newPermits
			})
			.then(function() {
					dispatch(receiveChangeDSLIPermits(true, newPermits))
				},
				function(error){
					dispatch(receiveChangeDSLIPermits(false, error))
				}
			)
	}
}
