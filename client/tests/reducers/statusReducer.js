import expect from 'expect'
import reducer from '../../reducers/todos'

describe('statusReducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(0)
  })

  it('should handle waiting', () => {
    expect(
      reducer({}, {
        type: 'waiting',
        operation: 'Run the tests'
      })
    ).toEqual(
      {
        loading: true,
				waitingFor: 'Run the tests',
				result: null,
				error: null
      }
    )

    expect(
      reducer(
        {
          loading: true,
  				waitingFor: 'Run the tests',
  				result: null,
  				error: null
        },
        {
          type: 'waiting',
          operation: 'Concluding this test'
        }
      )
    ).toEqual(
      {
        loading: true,
				waitingFor: 'Concluding this test',
				result: null,
				error: null
      }
    )
  })
  it('should handle error', () => {
    expect(
      reducer({}, {
        type: 'error',
        error: 'Test error'
      })
    ).toEqual(
      {
        loading: false,
        waitingFor: null,
        result: 'error',
        error: 'Test error'
      }
    )

    expect(
      reducer(
        {
          loading: false,
          waitingFor: null,
          result: 'error',
          error: 'Test error'
        },
        {
          type: 'error',
          error: 'Test super-error'
        }
      )
    ).toEqual(
      {
        loading: false,
        waitingFor: null,
        result: 'error',
        error: 'Test super-error'
      }
    )
  })
  it('should handle the various successfull operation', () => {
    expect(
      reducer({}, {
        type: 'changeAccessLevel'
      })
    ).toEqual(
      {
        loading: false,
        waitingFor: null,
        result: 'success',
        error: null
      }
    )
  })
  it('should handle checkUsername', () => {
    expect(
      reducer({}, {
        type: 'checkUsername'
      })
    ).toEqual(
      {
        loading: false,
        waitingFor: '',
        result: 'success',
        error: null, //potenzialmente non vero
        usernameValidity: true
      }
    )
  })
  it('should handle checkCompanyName', () => {
    expect(
      reducer({}, {
        type: 'checkCompanyName'
      })
    ).toEqual(
      {
        loading: false,
        waitingFor: null,
        result: 'success',
        error: null,
        companyNameValidity: true
      }
    )
  })
  it('should handle failedcheckCompanyName', () => {
    expect(
      reducer({}, {
        type: 'failedcheckCompanyName'
      })
    ).toEqual(
      {
        loading: false,
        waitingFor: null,
        result: 'failed',
        error: null,
        companyNameValidity: false
      }
    )
  })
  it('should handle failedCheckUsername', () => {
    expect(
      reducer({}, {
        type: 'failedCheckUsername'
      })
    ).toEqual(
      {
        loading: false,
        waitingFor: '',
        result: 'failed',
        error: null,
        usernameValidity: false
      }
    )
  })
  it('should handle logout', () => {
    expect(
      reducer({
        loading: false,
        waitingFor: '',
        result: 'failed',
        error: null,
        usernameValidity: false
      },
      {
        type: 'logout'
      })
    ).toEqual(0)
  })
})
