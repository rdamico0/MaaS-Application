import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/cloneDSLI'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator cloneDSLI',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "cloneDSLI" after having successfully posted the copy of the selected DSLI.', () => {
        nock('http://example.com/')
          .post('url', {}) //da mettere l'url, e i dati inseriti
          .reply(200, { id: 'ID', name: 'NAME', code: 'CODE'}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'cloneDSLI' },
          { type: 'cloneDSLI', DSLI: { id: 'ID', name: 'NAME', code: 'CODE'} }
        ]
        const store = mockStore({ DSLI: 0 })

        return store.dispatch(actions.cloneDSLI('NAME'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
