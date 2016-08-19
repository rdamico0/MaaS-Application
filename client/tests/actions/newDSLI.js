import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/newDSLI'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator newDSLI',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "newDSLI" after having successfully posted a new DSLI in the database.', () => {
        nock('http://example.com/')
          .post('url') //da mettere l'url
          .reply(200, { body: { todos: ['do something'] }}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'newDSLI' },
          { type: 'newDSLI',
            DSLI:
						{
							...
						}
          }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.newDSLI('nuovoNome'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
