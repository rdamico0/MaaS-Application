import expect from 'expect'
import reducer from '../../reducers/todos'

describe('currentDSLIReducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(0)
  })
  it('should handle getDSLI', () => {
    expect(
      reducer({}, {
        type: 'getDSLI',
        selected:
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
				}
      })
    ).toEqual(
      {
				id: 'ID',
				name: 'NAME',
				code: 'CODE',
				permit: 'PERMIT'
      }
    )

    expect(
      reducer(
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
	      },
				{
				type: 'getDSLI',
        selected:
				{
					id: 'ID1',
					name: 'NAME1',
					code: 'CODE1',
					permit: 'PERMIT1'
				}
      })
    ).toEqual(
			{
				id: 'ID1',
				name: 'NAME1',
				code: 'CODE1',
				permit: 'PERMIT1'
			}
    )
  })
	it('should handle execDSLI', () => {
    expect(
      reducer(
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
	      },
				{
				type: 'execDSLI',
        result: 'RESULT'
      })
    ).toEqual(
			{
				id: 'ID',
				name: 'NAME',
				code: 'CODE',
				permit: 'PERMIT',
				result: 'RESULT'
			}
    )
  })
	it('should handle renameDSLI', () => {
    expect(
      reducer(
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
	      },
				{
				type: 'renameDSLI',
        newName: 'NEWNAME'
      })
    ).toEqual(
			{
				id: 'ID',
				name: 'NEWNAME',
				code: 'CODE',
				permit: 'PERMIT',
				result: 'RESULT'
			}
    )
  })
	it('should handle saveTextDSLI', () => {
    expect(
      reducer(
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
	      },
				{
				type: 'saveTextDSLI',
        newName: 'NEWCODE'
      })
    ).toEqual(
			{
				id: 'ID',
				name: 'NAME',
				code: 'NEWCODE',
				permit: 'PERMIT',
				result: 'RESULT'
			}
    )
  })
	it('should handle newDSLI and cloneDSLI', () => {
    expect(
      reducer(
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
	      },
				{
				type: 'newDSLI',
        DSLI:
				{
					id: 'ID1',
					name: 'NAME1',
					code: 'CODE1',
					permit: 'PERMIT1'
				}
      })
    ).toEqual(
			{
				id: 'ID1',
				name: 'NAME1',
				code: 'CODE1',
				permit: 'PERMIT1'
			}
    )

		expect(
      reducer(
				{
					id: 'ID1',
					name: 'NAME1',
					code: 'CODE1',
					permit: 'PERMIT1'
				},
				{
				type: 'cloneDSLI',
        DSLI:
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
				}
      })
    ).toEqual(
			{
				id: 'ID',
				name: 'NAME',
				code: 'CODE',
				permit: 'PERMIT'
			}
    )
  })
	it('should handle logout', () => {
    expect(
      reducer(
				{
					id: 'ID',
					name: 'NAME',
					code: 'CODE',
					permit: 'PERMIT'
	      },
				{
				type: 'logout'
      })
    ).toEqual(0)
  })
})
