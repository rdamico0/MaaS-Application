import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/getDSLIList'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator getDSLIList',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "getDSLIList" after having successfully fetched the list of DSLI that the current user has access to.', () => {
        nock('http://example.com/')
          .get('url') //da mettere l'url
          .reply(200, {
						list: [
							{
								id: 'ID1',
								name: 'NAME1',
								code: 'CODE1',
								permit: 'PERMIT1'
							},
							{
								id: 'ID2',
								name: 'NAME2',
								code: 'CODE2',
								permit: 'PERMIT2'
							},
							{
								id: 'ID3',
								name: 'NAME3',
								code: 'CODE3',
								permit: 'PERMIT3'
							}
						]
					}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'changeImage' },
          { type: 'changeImage',
            listDSLI: [
							{
								id: 'ID1',
								name: 'NAME1',
								code: 'CODE1',
								permit: 'PERMIT1'
							},
							{
								id: 'ID2',
								name: 'NAME2',
								code: 'CODE2',
								permit: 'PERMIT2'
							},
							{
								id: 'ID3',
								name: 'NAME3',
								code: 'CODE3',
								permit: 'PERMIT3'
							}
						]
          }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.getDSLIList())
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
