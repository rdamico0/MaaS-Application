import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/changePassword'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator changePassword',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "changePassword" after having successfully updated the image.', () => {
        nock('http://example.com/')
          .put('url') //da mettere l'url
          .reply(200, { body: { todos: ['do something'] }}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'changePassword' },
          { type: 'changePassword' }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.changePassword('nuovaPassword'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
