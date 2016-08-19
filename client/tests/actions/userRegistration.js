import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/userRegistration'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator checkUsername',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "checkUsername" after having successfully verified that said username for the user is not already used.', () => {
        nock('http://example.com/')
          .get('url') //da mettere l'url, e i dati inseriti
          .reply(200, 0) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waitingCheckUsername' },
          { type: 'checkUsername' }
        ]
        const store = mockStore({ DSLI: 0 })

        return store.dispatch(actions.checkUsername('NAME'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)

describe('The action creator userRegistration',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "userRegistration" after having successfully posted the new user on the database.', () => {
        nock('http://example.com/')
          .post('url') //da mettere l'url, e i dati inseriti
          .reply(200, 0) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'userRegistration' },
          { type: 'userRegistration' }
        ]
        const store = mockStore({ DSLI: 0 })

        return store.dispatch(actions.userRegistration({user:'USER', password: 'PASSWORD'}))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
