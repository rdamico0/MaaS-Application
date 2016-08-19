import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/login'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator login',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "login" after having successfully logged the user in the system.', () => {
        nock('http://example.com/')
          .get('url') //da mettere l'url
          .reply(200, { email: 'EMAIL',
						name: 'NAME'
					}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'login' },
          { type: 'login',
            user:
						{
							email: 'EMAIL',
							name: 'NAME'
						}
          }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.login())
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const expectedAction = {
      type: 'logout'
    }
    expect(actions.logout()).toEqual(expectedAction)
  })
})
