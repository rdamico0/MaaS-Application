export default function currentDSLIReducer(state = 0, action) {
	switch(action.type) {
		case 'renameDSLI':
			return Object.assign({}, state, {
					name: action.newName
			})
		case 'saveTextDSLI':
			return Object.assign({}, state, {
					code: action.newText
			})
		case 'setDSLI':
			return {
				id: action.dsli.id,
				name: action.dsli.name,
				code: action.dsli.code,
				lastModifiedDate: action.dsli.lastModifiedDate,
				databaseId: action.dsli.databaseId
			}
		case 'getDSLI':
			return {
				id: action.selected.id,
				name: action.selected.name,
				code: action.selected.code,
				permit: action.selected.permit
			}
		case 'execDSLI':
			return Object.assign({}, state, {
					result: action.result
			})
		case 'newDSLI':
			return {
				id: action.DSLI.id, // o faccio una query per ottenere l'id oppure uso getDSLI
				name: action.DSLI.name,
				code: action.DSLI.code,
				permit: action.DSLI.permit
			}
		case 'cloneDSLI':
			return {
				id: action.DSLI.id,
				name: action.DSLI.name,
				code: action.DSLI.code,
				permit: action.DSLI.permit
			}
		case 'logout':
			return 0
		default:
			return state
	}
}
