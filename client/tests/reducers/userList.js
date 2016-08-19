export default function userListReducer(state = 0, action) {
	switch(action.type) {
    case 'getUserList':
		  return action.userList
		case 'logout':
			return 0
		default:
			return state
	}
}

import expect from 'expect'
import reducer from '../../reducers/todos'

describe('userListReducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(0)
  })
  it('should handle getUserList', () => {
    expect(
      reducer(0, {
        type: 'getUserList',
        userList:
				[
					{
						username: 'USERNAME',
						accessLevel: 'ACCESSLEVEL',
						image: 'IMAGE'
					},
					{
						username: 'USERNAME1',
						accessLevel: 'ACCESSLEVEL1',
						image: 'IMAGE1'
					},
					{
						username: 'USERNAME2',
						accessLevel: 'ACCESSLEVEL2',
						image: 'IMAGE2'
					}
				]
      })
    ).toEqual(
			[
				{
					username: 'USERNAME',
					accessLevel: 'ACCESSLEVEL',
					image: 'IMAGE'
				},
				{
					username: 'USERNAME1',
					accessLevel: 'ACCESSLEVEL1',
					image: 'IMAGE1'
				},
				{
					username: 'USERNAME2',
					accessLevel: 'ACCESSLEVEL2',
					image: 'IMAGE2'
				}
			]
    )
		expect(
      reducer([
				{
					username: 'USERNAME',
					accessLevel: 'ACCESSLEVEL',
					image: 'IMAGE'
				},
				{
					username: 'USERNAME1',
					accessLevel: 'ACCESSLEVEL1',
					image: 'IMAGE1'
				},
				{
					username: 'USERNAME2',
					accessLevel: 'ACCESSLEVEL2',
					image: 'IMAGE2'
				}
			],
			{
        type: 'getUserList',
        userList:
				[
					{
						username: 'USERNAME',
						accessLevel: 'ACCESSLEVEL',
						image: 'IMAGE'
					},
					{
						username: 'USERNAME1',
						accessLevel: 'ACCESSLEVEL1',
						image: 'IMAGE1'
					}
				]
      })
    ).toEqual(
			[
				{
					username: 'USERNAME',
					accessLevel: 'ACCESSLEVEL',
					image: 'IMAGE'
				},
				{
					username: 'USERNAME1',
					accessLevel: 'ACCESSLEVEL1',
					image: 'IMAGE1'
				}
			]
    )
  })
	it('should handle logout', () => {
    expect(
      reducer([
				{
					username: 'USERNAME',
					accessLevel: 'ACCESSLEVEL',
					image: 'IMAGE'
				},
				{
					username: 'USERNAME1',
					accessLevel: 'ACCESSLEVEL1',
					image: 'IMAGE1'
				}
			],
      {
        type: 'logout'
      })
    ).toEqual(0)
  })
})
