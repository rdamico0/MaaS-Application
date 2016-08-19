export default function currentUserReducer(state = 0, action) {
	switch(action.type) {
		case 'getUser':
			return action.selected
		case 'logout':
			return 0
		default:
			return state
	}
}
