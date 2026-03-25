import { Context, SQSEvent } from 'aws-lambda'
import {
  logger,
  appendZendeskIdToLogger,
  initialiseLogger
} from '../../utils/logger.js'
import { sendQueryCompletedQueueMessage } from './sendQueryCompletedQueueMessage.js'
import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket.js'

export const handler = async (event: SQSEvent, context: Context) => {
  initialiseLogger(context)

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
  logger.info('Successfully sent Query Completed Message to SQS')
  return eventDetails
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
    logger.error('Error parsing JSON: ', error as Error)
    return {}
  }
}
