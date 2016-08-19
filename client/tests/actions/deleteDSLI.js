import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/deleteDSLI'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator deleteDSLI',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "deleteDSLI" after having successfully deleted the selected DSLI from the database.', () => {
        nock('http://example.com/')
          .del('url') //da mettere l'url, e i dati inseriti
          .reply(200, ...) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'deleteDSLI' },
          { type: 'deleteDSLI' }
        ]
        const store = mockStore({ DSLI: 0 })

        return store.dispatch(actions.deleteDSLI())
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
