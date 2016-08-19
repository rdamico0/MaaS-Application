		case 'newDSLI':
		case 'cloneDSLI':
		{
			var temp = Object.assign({}, state)
			temp.push({
				id: action.DSLI.id,
				name: action.DSLI.name,
				permit: action.DSLI.permit //da rivedere -> dovrebbe essere sempre quello per quelli creati
			})
		}
		case 'logout':
			return 0
		default:
			return state
	}
}

import expect from 'expect'
import reducer from '../../reducers/todos'

describe('DSLIListReducer', () => {
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
					DSLIList:
					[
						{
							id: 'ID',
							name: 'NAME',
							permit: 'PERMIT'
						},
						{
							id: 'ID1',
							name: 'NAME1',
							permit: 'PERMIT1'
						},
						{
							id: 'ID2',
							name: 'NAME2',
							permit: 'PERMIT2'
						}
					]
				}
      })
    ).toEqual(
			[
				{
					id: 'ID',
					name: 'NAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				}
			]
    )
  })
	it('should handle getDSLIList', () => {
    expect(
      reducer([
				{
					id: 'ID',
					name: 'NAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				}
			],
			{
        type: 'getDSLIList',
        list:
				[
					{
						id: 'ID',
						name: 'NAME',
						permit: 'PERMIT'
					},
					{
						id: 'ID1',
						name: 'NAME1',
						permit: 'PERMIT1'
					},
					{
						id: 'ID2',
						name: 'NAME2',
						permit: 'PERMIT2'
					},
					{
						id: 'ID3',
						name: 'NAME3',
						permit: 'PERMIT3'
					}
				]
      })
    ).toEqual(
			[
				{
					id: 'ID',
					name: 'NAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				}
			]
    )
  })
	it('should handle renameDSLI', () => {
    expect(
      reducer([
				{
					id: 'ID',
					name: 'NAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				}
			],
			{
        type: 'renameDSLI',
        DSLI:
				{
					id: 'ID',
					name: 'NEWNAME',
					permit: 'PERMIT'
				}
      })
    ).toEqual(
			[
				{
					id: 'ID',
					name: 'NEWNAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				}
			]
    )
  })
	it('should handle deleteDSLI', () => {
    expect(
      reducer([
				{
					id: 'ID',
					name: 'NAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				}
			],
			{
        type: 'deleteDSLI',
        DSLI:
				{
					id: 'ID',
					name: 'NEWNAME',
					permit: 'PERMIT'
				}
      })
    ).toEqual(
			[
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				}
			]
    )
  })
	it('should handle newDSLI and cloneDSLI', () => {
    expect(
      reducer([
				{
					id: 'ID',
					name: 'NAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				}
			],
			{
        type: 'newDSLI',
        DSLI:
				{
					id: 'ID4',
					name: 'NAME4',
					permit: 'PERMIT4'
				}
      })
    ).toEqual(
			[
				{
					id: 'ID',
					name: 'NEWNAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				},
				{
					id: 'ID4',
					name: 'NAME4',
					permit: 'PERMIT4'
				}
			]
    )
  })
	it('should handle logout', () => {
    expect(
      reducer([
				{
					id: 'ID',
					name: 'NEWNAME',
					permit: 'PERMIT'
				},
				{
					id: 'ID1',
					name: 'NAME1',
					permit: 'PERMIT1'
				},
				{
					id: 'ID2',
					name: 'NAME2',
					permit: 'PERMIT2'
				},
				{
					id: 'ID3',
					name: 'NAME3',
					permit: 'PERMIT3'
				},
				{
					id: 'ID4',
					name: 'NAME4',
					permit: 'PERMIT4'
				}
			],
      {
        type: 'logout'
      })
    ).toEqual(0)
  })
})
