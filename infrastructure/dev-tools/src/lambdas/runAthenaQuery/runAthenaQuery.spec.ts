import { vi, describe, it, expect, beforeEach } from 'vitest'

import { mockClient } from 'aws-sdk-client-mock'
import {
  AthenaClient,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  QueryExecutionState,
  StartQueryExecutionCommand
} from '@aws-sdk/client-athena'
import { runAthenaQuery } from './runAthenaQuery'

const athenaMock = mockClient(AthenaClient)

const testQuery = 'my-query'
const testDatabase = 'my-database'
const testWorkgroup = 'my-workgroup'
const testMaxRetries = 999
const testParams = {
  query: testQuery,
  workgroup: testWorkgroup,
  database: testDatabase,
  maxRetries: testMaxRetries
}

const mockQueryExecutionId = '123-abc'
const mockQueryResults = [
  {
    'header 1': 'row 1 col 1',
    'header 2': 'row 1 col 2'
  },
  {
    'header 1': 'row 2 col 1',
    'header 2': 'row 2 col 2'
  }
]
describe('runAthenaQuery', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers()
    athenaMock.reset()
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('fails quickly if the query does not return an QueryExecutionId', async () => {
    athenaMock.on(StartQueryExecutionCommand).resolves({})

    await expect(runAthenaQuery(testParams)).rejects.toThrow(
      'did not return a QueryExecutionId'
    )
  })

  test.each([[QueryExecutionState.CANCELLED], [QueryExecutionState.FAILED]])(
    'fails if the query is %s',
    async (status) => {
      const reason = 'unit testing'
      // mock the query start
      athenaMock
        .on(StartQueryExecutionCommand)
        .resolves({ QueryExecutionId: mockQueryExecutionId })

      // mock the query status
      athenaMock.on(GetQueryExecutionCommand).resolves({
        QueryExecution: {
          Status: {
            State: status,
            StateChangeReason: reason
          }
        }
      })

      await expect(runAthenaQuery(testParams)).rejects.toThrow(
        `${mockQueryExecutionId} ${status}: ${reason}`
      )
    }
  )

  it('pauses until a query has finished, then returns the results', async () => {
    // mock the query start
    athenaMock
      .on(StartQueryExecutionCommand)
      .resolves({ QueryExecutionId: mockQueryExecutionId })

    // mock the query status to be running and then succeeded
    athenaMock
      .on(GetQueryExecutionCommand)
      .resolvesOnce({
        QueryExecution: {
          Status: {
            State: QueryExecutionState.RUNNING
          }
        }
      })
      .resolvesOnce({
        QueryExecution: {
          Status: {
            State: QueryExecutionState.SUCCEEDED
          }
        }
      })

    // finally the query results
    athenaMock.on(GetQueryResultsCommand).resolves({
      ResultSet: {
        Rows: [
          {
            Data: [
              {
                VarCharValue: 'header 1'
              },
              {
                VarCharValue: 'header 2'
              }
            ]
          },
          {
            Data: [
              { VarCharValue: 'row 1 col 1' },
              { VarCharValue: 'row 1 col 2' }
            ]
          },
          {
            Data: [
              { VarCharValue: 'row 2 col 1' },
              { VarCharValue: 'row 2 col 2' }
            ]
          }
        ]
      }
    })

    // IMPORTANT: Slightly odd test structure to allow for timer mocking
    // we get a reference to the promise which is pending on the timer
    const returnedResultsPromise = runAthenaQuery(testParams)

    // then we trigger all of the async timers to progress
    await vi.runAllTimersAsync()

    // finally we can get the results as you'd expect
    const returnedResults = await returnedResultsPromise

    expect(returnedResults).toEqual(mockQueryResults)
  })
})
