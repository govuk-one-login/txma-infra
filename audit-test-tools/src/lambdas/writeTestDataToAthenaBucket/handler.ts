import { Context, SQSEvent } from 'aws-lambda'
import {
  logger,
  appendZendeskIdToLogger,
  initialiseLogger
} from '../../utils/logger'
import { sendQueryCompletedQueueMessage } from './sendQueryCompletedQueueMessage'
import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket'

export const handler = async (event: SQSEvent, context: Context) => {
  initialiseLogger(context)
  logger.info('Handling write test data to athena output bucket event')

  const eventDetails = parseRequestDetails(event)
  appendZendeskIdToLogger(eventDetails.zendeskId)
  await writeTestFileToAthenaOutputBucket(
    eventDetails.athenaQueryId,
    eventDetails.fileContents
  )

  await sendQueryCompletedQueueMessage(
    eventDetails.athenaQueryId,
    eventDetails.zendeskId,
    eventDetails.recipientEmail ?? 'mytestrecipientemail@test.gov.uk'
  )
  return eventDetails
}

const parseRequestDetails = (event: SQSEvent) => {
  if (!event.Records.length) {
    throw Error('No data in event')
  }

  const eventBody = event.Records[0].body
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
