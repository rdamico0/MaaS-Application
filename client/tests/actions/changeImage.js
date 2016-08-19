import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/changeImage'
import nock from 'nock'
import expect from 'expect' // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('The action creator changeImage',
  function() {
    return {
      afterEach(function() {
        return nock.cleanAll()
      })

      it('creates an action of type "changeImage" after having successfully updated the image.', () => {
        nock('http://example.com/')
          .put('url') //da mettere l'url
          .reply(200, { body: { todos: ['do something'] }}) //non so cosa restituisca loopback

        const expectedActions = [
          { type: 'waiting', operation: 'changeImage' },
          { type: 'changeImage',
            image: 'prova.jpg'
          }
        ]
        const store = mockStore({ image: null })

        return store.dispatch(actions.changeImage('prova.jpg'))
          .then(function() {
            return expect(store.getActions()).toEqual(expectedActions)
          })
      })
    }
  }
)
