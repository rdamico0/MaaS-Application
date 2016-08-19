import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/getDSLI'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator getDSLI',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "getDSLI" after having successfully fetched the complete informations of the selected DSLI.', () => {
        nock('http://example.com/')
          .get('url') //da mettere l'url
          .reply(200, { id: 'ID',
						name: 'NAME',
						code: 'CODE',
						permit: 'PERMIT'
					}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'getDSLI' },
          { type: 'getDSLI',
            selected:
						{
							id: 'ID',
							name: 'NAME',
							code: 'CODE',
							permit: 'PERMIT'
						}
          }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.getDSLI())
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
