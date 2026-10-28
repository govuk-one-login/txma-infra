import {
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  QueryExecutionState,
  Row,
  StartQueryExecutionCommand
} from '@aws-sdk/client-athena'

import { athenaClient } from './athenaClient'
import { AthenQueryDetails } from '../../types/athenaQueryDetails'

export const runAthenaQuery = async (params: AthenQueryDetails) => {
  const { QueryExecutionId } = await athenaClient.send(
    new StartQueryExecutionCommand({
      QueryString: params.query,
      QueryExecutionContext: {
        Database: params.database
      },
      // The workgroup supplies (and may enforce) the result OutputLocation, so
      // we deliberately do not set ResultConfiguration.OutputLocation here.
      WorkGroup: params.workgroup
    })
  )

  if (!QueryExecutionId) {
    throw new Error(
      'Athena StartQueryExecution did not return a QueryExecutionId'
    )
  }

  await waitForQueryToSucceed(QueryExecutionId, params.maxRetries)

  const results = await athenaClient.send(
    new GetQueryResultsCommand({ QueryExecutionId })
  )

  return parseResultRows(results.ResultSet?.Rows ?? [])
}

const waitForQueryToSucceed = async (
  queryExecutionId: string,
  maxRetries: number
): Promise<void> => {
  let retryCount = 0
  let state: QueryExecutionState | undefined

  while (retryCount <= maxRetries) {
    const { QueryExecution } = await athenaClient.send(
      new GetQueryExecutionCommand({ QueryExecutionId: queryExecutionId })
    )

    state = QueryExecution?.Status?.State

    if (state === QueryExecutionState.SUCCEEDED) {
      return
    }

    if (
      state === QueryExecutionState.FAILED ||
      state === QueryExecutionState.CANCELLED
    ) {
      const reason =
        QueryExecution?.Status?.StateChangeReason ?? 'no reason provided'
      throw new Error(`Athena query ${queryExecutionId} ${state}: ${reason}`)
    }

    // still QUEUED or RUNNING
    await pause(exponentialBackoff(retryCount + 1, 2))
    retryCount++
  }

  throw new Error(
    `Athena query ${queryExecutionId} did not succeed within ${maxRetries} retries. Current state ${state}`
  )
}

const parseResultRows = (rows: Row[]): Record<string, string>[] => {
  if (rows.length <= 1) {
    return []
  }

  const headers = (rows[0]?.Data ?? []).map((cell) => cell.VarCharValue ?? '')

  return rows.slice(1).map((row) => {
    const values = row.Data ?? []
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = values[index]?.VarCharValue ?? ''
    })
    return record
  })
}

const exponentialBackoff = (
  retryCount: number,
  backoffFactor: number
): number => {
  const baseDelay = 1000 // Initial delay in milliseconds
  const maxDelay = 60000 // Maximum delay in milliseconds

  const delay = Math.pow(backoffFactor, retryCount) * baseDelay
  return Math.min(delay, maxDelay)
}

const pause = (delay: number): Promise<unknown> => {
  return new Promise((r) => setTimeout(r, delay))
}
