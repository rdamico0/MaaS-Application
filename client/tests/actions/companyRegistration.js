import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/companyRegistration'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator checkCompanyName',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "checkCompanyName" after having successfully verified that said name for the company is not already used.', () => {
        nock('http://example.com/')
          .get('url') //da mettere l'url, e i dati inseriti
          .reply(200, 0) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waitingCheckCompanyName' },
          { type: 'checkCompanyName' }
        ]
        const store = mockStore({ DSLI: 0 })

        return store.dispatch(actions.checkCompanyName('NAME'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)

describe('The action creator companyRegistration',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "companyRegistration" after having successfully posted the new company on the database.', () => {
        nock('http://example.com/')
          .post('url') //da mettere l'url, e i dati inseriti
          .reply(200, 0) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'companyRegistration' },
          { type: 'companyRegistration' }
        ]
        const store = mockStore({ DSLI: 0 })

        return store.dispatch(actions.companyRegistration({companyName:'NAME', databaseLink: 'DBLINK'}))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
