import { SQSEvent } from 'aws-lambda'
import { sendQueryCompletedQueueMessage } from './sendQueryCompletedQueueMessage'
import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket'

export const handler = async (event: SQSEvent) => {
  console.log(
    'Handling write test data to athena output bucket event',
    JSON.stringify(event, null, 2)
  )

  const eventDetails = parseRequestDetails(event)

  await writeTestFileToAthenaOutputBucket(
    eventDetails.athenaQueryId,
    eventDetails.fileContents
  )

  await sendQueryCompletedQueueMessage(eventDetails.athenaQueryId)
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
  if (!requestDetails.athenaQueryId || !requestDetails.fileContents) {
    throw Error(
      'Event data was not of the correct type, should have athenaQueryId and fileContents properties'
    )
  }

  return requestDetails
}

const tryParseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error parsing JSON: ', error)
    return {}
  }
}
