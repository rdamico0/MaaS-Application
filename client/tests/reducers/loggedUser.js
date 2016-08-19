import expect from 'expect'
import reducer from '../../reducers/todos'

describe('loggedUserReducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(0)
  })
  it('should handle login', () => {
    expect(
      reducer(0, {
        type: 'login',
        user:
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
	it('should handle changeAccessLevel', () => {
    expect(
      reducer({
				username: 'USERNAME',
				accessLevel: 'ACCESSLEVEL',
				image: 'IMAGE'
      },
			{
        type: 'changeAccessLevel',
        newLevel: 'NEWLEVEL'
      })
    ).toEqual(
      {
				username: 'USERNAME',
				accessLevel: 'NEWLEVEL',
				image: 'IMAGE'
      }
    )
  })
	it('should handle changeImage', () => {
    expect(
      reducer({
				username: 'USERNAME',
				accessLevel: 'ACCESSLEVEL',
				image: 'IMAGE'
      },
			{
        type: 'changeImage',
        image: 'NEWIMAGE'
      })
    ).toEqual(
      {
				username: 'USERNAME',
				accessLevel: 'LEVEL',
				image: 'NEWIMAGE'
      }
    )
  })
	it('should handle logout', () => {
    expect(
      reducer({
				username: 'USERNAME',
				accessLevel: 'LEVEL',
				image: 'NEWIMAGE'
      },
      {
        type: 'logout'
      })
    ).toEqual(0)
  })
})
