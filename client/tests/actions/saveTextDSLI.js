import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/saveTextDSLI'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator saveTextDSLI',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "saveTextDSLI" after having successfully modified the code of the selected DSLI.', () => {
        nock('http://example.com/')
          .post('url') //da mettere l'url
          .reply(200, DSLI: {}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'saveTextDSLI' },
          { type: 'saveTextDSLI',
            DSLI:
						{
							...
						}
          }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.saveTextDSLI('nuovoNome'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
