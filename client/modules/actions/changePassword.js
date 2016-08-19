export function requestChangePassword() {
	return {
		type: 'waiting',
		operation: 'changePassword'
	}
}

export function receiveChangePassword(bool, text) {
	if(bool) return { type: 'changePassword' }
	else return {
		type: 'error',
		error: text
	}
}

export function changePassword(newPassword) {
	return function(dispatch){
		dispatch(requestChangePassword())
		return request
			.put('url1')
			.send({
				password: newPassword
			})
			.then(
				function(){
					dispatch(receiveChangePassword(true))
				},
				function(error){
					dispatch(receiveChangePassword(false, error))
				}
			)
	}
}
