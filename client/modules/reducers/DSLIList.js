export default function DSLIListReducer(state = 0, action) {
	switch(action.type) {
    case 'login':
		  return action.user.DSLIList
			//se questo non va si può chiamare dalla action getDSLIList
		case 'getDSLIList':
			console.log(action);
			return action.listDSLI
		case 'renameDSLI':
		{
			var temp = Object.assign({}, state)
			for (var i=0; i < temp.length; i++)
				if (temp[i].name === action.oldName)
					temp[i].name = action.newName
			return temp
		}
		case 'newDSLI':
		{
			var temp = Object.assign({}, state)
			temp.push({
				id: action.DSLI.id,
				name: action.DSLI.name,
				permit: action.DSLI.permit //da rivedere -> dovrebbe essere sempre quello per quelli creati
			})
		}
		case 'cloneDSLI':
		{
			var temp = Object.assign({}, state)
			temp.push({
				id: action.DSLI.id,
				name: action.DSLI.name,
				permit: action.DSLI.permit //da rivedere -> dovrebbe essere sempre quello per quelli creati
			})
		}
		case 'deleteDSLI':
		{
			var temp = Object.assign({}, state)
			temp.splice(array.indexOf(action.DSLI.id), 1);
			return temp
		}
		case 'logout':
			return 0
		default:
			return state
	}
}
