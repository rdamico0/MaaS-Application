export function requestRenameDSLI() {
	return {
		type: 'waiting',
		operation: 'renameDSLI'
	}
}

export function receiveRenameDSLI(bool, text) {
	if(bool) return {
		type: 'renameDSLI',
		newName: text
	}
	else return {
		type: 'error',
		error: text
	}
}

export function renameDSLI(newName) {
	return function(dispatch){
		dispatch(requestRenameDSLI())
		return request
			.put('url1')
			.send({
				name: newName
			})
			.then(
				function(){
					dispatch(receiveRenameDSLI(true, newName))
				},
				function(error){
					dispatch(receiveRenameDSLI(false, error))
				}
			)
	}
}
