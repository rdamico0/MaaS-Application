export default function loggedUserReducer(state = 0, action) {
	switch(action.type) {
		case 'changeImage':
			return Object.assign({}, state, {
					image: action.image
			})
		case 'login':
			return {
				username: action.user.username,
				accessLevel: action.user.accessLevel,
				company: action.user.company,
				token: action.user.token,
				image: action.user.image
			}
		case 'changeAccessLevel':
			return Object.assign({}, state, {
				accessLevel: action.newLevel
			})
		case 'logout':
			return 0
		default:
			return state
	}
}
