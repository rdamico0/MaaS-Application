export default function statusReducer(state = 0, action) {
switch(action.type) {
	case 'initialize':
		return {
			loading: false,
			waitingFor: null,
			result: null,
			error: null
		}
	case 'waiting':
		return  Object.assign({}, state, {
			loading: true,
			waitingFor: action.operation,
			result: null,
			error: null
		})
    	case 'error':
		return Object.assign({}, state, {
				loading: false,
				waitingFor: null,
				result: 'error',
				error: action.error
		})

	case 'changeAccessLevel':
	case 'changeDSLIPermits':
	case 'changeImage':
	case 'changePassword':
	case 'cloneDSLI':
	case 'companyRegistration':
	case 'deleteDSLI':
	case 'deleteUser':
	case 'deleteData':
	case 'embodyUser':
	case 'getDSLI':
	case 'getDSLIList':
	case 'login':
	case 'newDSLI':
	case 'renameDSLI':
	case 'saveTextDSLI':
	case 'userRegistration':
	case 'addDatabase':
	case 'getDatabase':
		return Object.assign({}, state, {
				loading: false,
				waitingFor: null,
				result: 'success',
				error: null
		})
	case 'checkUsername':
		return Object.assign({}, state, {
				loading: false,
				waitingFor: '',
				result: 'success',
				error: null, //potenzialmente non vero
				usernameValidity: true
		})
	case 'checkCompanyName':
		return Object.assign({}, state, {
				loading: false,
				waitingFor: null,
				result: 'success',
				error: null,
				companyNameValidity: true
		})
	case 'failedcheckCompanyName':
		return Object.assign({}, state, {
				loading: false,
				waitingFor: null,
				result: 'failed',
				error: null,
				companyNameValidity: false
		})
	case 'failedCheckUsername':
		return Object.assign({}, state, {
				loading: false,
				waitingFor: '',
				result: 'failed',
				error: null,
				usernameValidity: false
		})
	case 'logout':
		return 0
	default:
		return state
	}
}
