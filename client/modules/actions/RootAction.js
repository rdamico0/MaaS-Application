import request from 'superagent'
import {push} from 'react-router-redux'
import {changeDSLIPermits} from './changeDSLIPermits'
import {changeImage} from './changeImage'
import {changePassword} from './changePassword'
import {cloneDSLI} from './cloneDSLI'
import {checkCompanyName, companyRegistration} from './companyRegistration'
import {deleteDSLI} from './deleteDSLI'
import {deleteUser} from './deleteUser'
import {deleteData} from './deleteData'
import {embodyUser} from './embodyUser'
import {getDSLI} from './getDSLI'
import {getDSLIList} from './getDSLIList'
import {login, logout} from './login'
import {newDSLI} from './newDSLI'
import {renameDSLI} from './renameDSLI'
import {saveTextDSLI} from './saveTextDSLI'
import {getDatabase} from './getDatabase'
import {addDatabase} from './addDatabase'
import {checkUsername, userRegistration} from './userRegistration'

export {
  addDatabase,
  changeDSLIPermits,
  changeImage,
  changePassword,
  cloneDSLI,
  checkCompanyName,
  companyRegistration,
  deleteDSLI,
  deleteUser,
  deleteData,
  embodyUser,
  getDatabase,
  getDSLI,
  getDSLIList,
  login,
  logout,
  newDSLI,
  renameDSLI,
  saveTextDSLI,
  checkUsername,
  userRegistration
}

export function displayError(error){
  return { type: 'ERR',
           err : error
  }
}

export function refresh(){
  return { type: '-'}
}

export function redirect(url){
  return function(dispatch){
  		dispatch(push(url))
  }
}

export function setDSLI(DSLI) {
	return {
		type: 'setDSLI',
		dsli: DSLI
	}
}
/*
export function updateCompanies(json){
  return { type: 'RECEIVED_COMPANIES',
           companies : json
  }
}

export function attemptLogin(user, pwd){
  return function(dispatch){
    dispatch(login("asd","asd"))
    dispatch(redirect('/home'))
  }
}

export function login(user, pwd){
  return { type: 'AT' }
}

export function logout(user, pwd){
  return { type: 'AL' }
}



/*
export function getProfile(store, email){
  /*var promise = request
  .head('http://www.zinoo.it:3000/api/users/'+email)
  .then(function(err){
    store.dispatch(push('/login/repwd'))
  },
  function(err){
    store.dispatch(push('/login/repwd'))
    //store.dispatch(displayError("ERRORE UTENTE NON REGISTRATO"));
  })


  return { type: 'REQUESTED_PROFILE',
           value: {
             email : "ciccio@pasticcio",
             name : "Pasticcio Ciccio"
           }
        }
}


export function emailResetPassword(email){
  var promise = request
  .head('http://www.zinoo.it:3000/api/users/'+email)
  .then(function(err){
    dispatch(push('/login/repwd'))
  },
  function(err){
    dispatch(displayError("ERRORE UTENTE NON REGISTRATO"));
  })

  return { type: 'REQUESTED_COMPANY_EXISTANCE' }
}


export function signCompany(company, owner){
  var promise = request
  .head('http://www.zinoo.it:3000/api/aziende/'+company)
  .then(function(err){
    store.dispatch(displayError("ERRORE AZIENDA GIA REGISTRATA"));
  },
  function(err){
    store.dispatch(postCompany(company, owner));
  })

  return { type: 'REQUESTED_COMPANY_EXISTANCE' }
}

export function postCompany(company, owner){
  var promise = request
  .post('http://www.zinoo.it:3000/api/aziende')
  .send({
    nome: company,
    partitaIva: "0000",
    proprietario: owner,
    id: company
  })
  .then(function(err){
    store.dispatch(updateCompanies(err.text));
  },
  function(err){
    store.dispatch(displayError(err.toString()));
  })

  return { type: 'REQUESTED_SIGNIN' }
}

export function getCompanies(){
  var promise = request
  .get('http://www.zinoo.it:3000/api/aziende')
  .then(function(err){
    store.dispatch(updateCompanies(err.text));
  },
  function(err){
    store.dispatch(displayError(err.toString()));
  })

  return { type: 'REQUESTED_COMPANIES' }
}

*/
