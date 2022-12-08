import { SQSEvent } from 'aws-lambda'
import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket'

export const handler = async (event: SQSEvent) => {
  console.log(
    'Handling QR integration tests trigger setup event',
    JSON.stringify(event, null, 2)
  )

  const message = parseRequestDetails(event)

  await writeTestFileToAthenaOutputBucket(
    message.fileName,
    message.fileContents
  )

  return message
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
  if (!requestDetails.fileName || !requestDetails.fileContents) {
    throw Error('Event data was not of the correct type')
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
