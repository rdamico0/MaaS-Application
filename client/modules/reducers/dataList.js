export default function DSLIListReducer(state = 0, action) {
	switch(action.type) {
		case 'getDatabase':
			console.log(action);
			return action.listData
		case 'deleteData':
		{
			var temp = Object.assign({}, state)
			temp.splice(array.indexOf(action.id), 1);
			return temp
		}
		case 'logout':
			return 0
		default:
			return state
	}
}
