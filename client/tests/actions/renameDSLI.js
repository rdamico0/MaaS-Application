import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/renameDSLI'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator renameDSLI',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "renameDSLI" after having successfully modified the name of the selected DSLI.', () => {
        nock('http://example.com/')
          .post('url') //da mettere l'url
          .reply(200, DSLI: {}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'renameDSLI' },
          { type: 'renameDSLI',
            DSLI:
						{
							...
						}
          }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.renameDSLI('nuovoNome'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
