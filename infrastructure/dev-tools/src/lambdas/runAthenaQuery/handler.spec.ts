import { vi } from 'vitest'
import { describe, it, expect } from 'vitest'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
import { handler } from './handler'
import { runAthenaQuery } from './runAthenaQuery'
import { AthenQueryDetails } from '../../types/athenaQueryDetails'

vi.mock('./runAthenaQuery', () => ({
  runAthenaQuery: vi.fn()
}))

describe('run athena queries on-demand', () => {
  it('returns error with invalid parameters', async () => {
    await expect(
      handler(
        { invalid: 'test' } as unknown as AthenQueryDetails,
        mockLambdaContext
      )
    ).rejects.toThrow('Function called with invalid parameters')
  })

  it('Passes the correct data to s3DownloadFileToString', async () => {
    const testQuery = 'my-query'
    const testDatabase = 'my-database'
    const testWorkgroup = 'my-workgroup'
    const testMaxRetries = 999
    const testQueryResults = [{ test: 'results' }]
    vi.mocked(runAthenaQuery).mockResolvedValue(testQueryResults)

    const result = await handler(
      {
        query: testQuery,
        database: testDatabase,
        workgroup: testWorkgroup,
        maxRetries: testMaxRetries
      },
      mockLambdaContext
    )

    expect(result).toEqual(testQueryResults)
    expect(runAthenaQuery).toHaveBeenCalledWith({
      query: testQuery,
      database: testDatabase,
      workgroup: testWorkgroup,
      maxRetries: testMaxRetries
    })
  })
})
