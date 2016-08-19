import {newDSLI} from './newDSLI'

export function cloneDSLI(dsli) {
	return function(dispatch){
		dsli.name = "Clone of "+ dsli.name
		dispatch(newDSLI(dsli))
	}
}
