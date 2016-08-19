import expect from 'expect'
import reducer from '../../reducers/todos'

describe('currentUserReducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(0)
  })
  it('should handle getUser', () => {
    expect(
      reducer(0, {
        type: 'getUser',
        selected:
				{
					username: 'USERNAME',
					accessLevel: 'ACCESSLEVEL',
					image: 'IMAGE'
				}
      })
    ).toEqual(
      {
				username: 'USERNAME',
				accessLevel: 'ACCESSLEVEL',
				image: 'IMAGE'
      }
    )
  })
	it('should handle logout', () => {
    expect(
      reducer({
				username: 'USERNAME',
				accessLevel: 'LEVEL',
				image: 'IMAGE'
      },
      {
        type: 'logout'
      })
    ).toEqual(0)
  })
})
