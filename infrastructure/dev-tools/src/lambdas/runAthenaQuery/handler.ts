import { Context } from 'aws-lambda'
import { initialiseLogger, logger } from '../../utils/logger'
import { AthenQueryDetails } from '../../types/athenaQueryDetails'
import { runAthenaQuery } from './runAthenaQuery'
import { ERROR_CODES } from '../../utils/errorCodes'

export const handler = async (
  params: AthenQueryDetails,
  context: Context
): Promise<Record<string, string>[]> => {
  initialiseLogger(context)

  const startTime = Date.now()
  logger.info('Handler started', {
    ...params
  })

  if (
    !params?.query ||
    !params?.database ||
    !params?.workgroup ||
    !params?.maxRetries
  ) {
    logger.error('Handler failed due to invalid parameters', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.DT002,
        message: 'Function called with invalid parameters'
      }
    })
    throw Error('Function called with invalid parameters')
  }

  let results: Record<string, string>[]
  try {
    results = await runAthenaQuery(params)
  } catch (error) {
    let errorMessage = 'unknown error occured'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    logger.error('Handler failed', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        message: errorMessage
      }
    })
    throw error
  }

  logger.info('Handler completed', {
    outcome: 'success',
    duration: Date.now() - startTime
  })

  return results
}
