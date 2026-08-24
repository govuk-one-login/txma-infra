import { Context, SQSEvent } from 'aws-lambda'
import {
  logger,
  appendZendeskIdToLogger,
  initialiseLogger
} from '../../utils/logger.js'
import { sendQueryCompletedQueueMessage } from './sendQueryCompletedQueueMessage.js'
import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (event: SQSEvent, context: Context) => {
  initialiseLogger(context)

  const startTime = Date.now()
  const correlationId = event.Records[0]?.messageId
  logger.info('Handler started', {
    correlationId,
    recordCount: event.Records.length
  })

  try {
    const eventDetails = parseRequestDetails(event)
    appendZendeskIdToLogger(eventDetails.zendeskId)

    await writeTestFileToAthenaOutputBucket(
      eventDetails.athenaQueryId,
      eventDetails.fileContents
    )

    await sendQueryCompletedQueueMessage(
      eventDetails.athenaQueryId,
      eventDetails.zendeskId,
      eventDetails.recipientEmail ?? 'mytestrecipientemail@example.gov.uk'
    )

    logger.info('Handler completed', {
      correlationId,
      outcome: 'success',
      duration: Date.now() - startTime
    })

    return eventDetails
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Handler failed', {
      correlationId,
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.AT001,
        message: err.message,
        name: err.name,
        stack: err.stack
      }
    })
    throw error
  }
}

const parseRequestDetails = (event: SQSEvent) => {
  const record = event.Records[0]
  if (!record) {
    throw Error('No data in event')
  }

  const eventBody = record.body
  if (!eventBody) {
    throw Error('No body found in event')
  }

  const requestDetails = tryParseJSON(eventBody)
  if (
    !requestDetails.athenaQueryId ||
    !requestDetails.fileContents ||
    !requestDetails.zendeskId
  ) {
    throw Error(
      'Event data was not of the correct type, should have athenaQueryId, fileContents, and zendeskId properties'
    )
  }

  return requestDetails
}

const tryParseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Error parsing JSON body', {
      error: {
        code: ERROR_CODES.AT005,
        message: err.message,
        name: err.name,
        stack: err.stack
      }
    })
    return {}
  }
}
