import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/deleteUser'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator deleteUser',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "deleteUser" after having successfully deleted the selected user form the database.', () => {
        nock('http://example.com/')
          .del('url') //da mettere l'url, e i dati inseriti
          .reply(200, ...) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'deleteUser' },
          { type: 'deleteUser' }
        ]
        const store = mockStore({ DSLI: 0 })

        return store.dispatch(actions.deleteUser())
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
