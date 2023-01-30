import { constructSqsEvent } from '../../utils/tests/constructSqsEvent'
import {
  EXPECTED_DEFAULT_EMAIL_ADDRESS,
  TEST_ATHENA_QUERY_ID,
  TEST_EMAIL_ADDRESS,
  TEST_FILE_CONTENTS,
  TEST_ZENDESK_ID
} from '../../utils/tests/testConstants'
import { handler } from './handler'
import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket'
import { sendQueryCompletedQueueMessage } from './sendQueryCompletedQueueMessage'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
jest.mock('./writeTestFileToAthenaOutputBucket', () => ({
  writeTestFileToAthenaOutputBucket: jest.fn()
}))
jest.mock('./sendQueryCompletedQueueMessage', () => ({
  sendQueryCompletedQueueMessage: jest.fn()
}))

describe('writeTestDataToAthenaBucket handler', () => {
  it('should throw an appropriate error if there is no data in the event', async () => {
    await expect(handler({ Records: [] }, mockLambdaContext)).rejects.toThrow(
      'No data in event'
    )
  })

  it('should throw an appropriate error if the request includes data of the wrong shape', async () => {
    const writeTestDataToAthenaBucketEvent = constructSqsEvent(
      JSON.stringify({ someProperty: 'someValue' })
    )
    await expect(
      handler(writeTestDataToAthenaBucketEvent, mockLambdaContext)
    ).rejects.toThrow('Event data was not of the correct type')
  })

  it('should call writeTestFileToAthenaOutputBucket and sendQueryCompletedQueueMessage with the correct parameters', async () => {
    const writeTestDataToAthenaBucketEvent = constructSqsEvent(
      JSON.stringify({
        athenaQueryId: TEST_ATHENA_QUERY_ID,
        fileContents: TEST_FILE_CONTENTS,
        zendeskId: TEST_ZENDESK_ID,
        recipientEmail: TEST_EMAIL_ADDRESS
      })
    )

    await handler(writeTestDataToAthenaBucketEvent, mockLambdaContext)

    expect(writeTestFileToAthenaOutputBucket).toHaveBeenCalledWith(
      TEST_ATHENA_QUERY_ID,
      TEST_FILE_CONTENTS
    )

    expect(sendQueryCompletedQueueMessage).toHaveBeenCalledWith(
      TEST_ATHENA_QUERY_ID,
      TEST_ZENDESK_ID,
      TEST_EMAIL_ADDRESS
    )
  })

  it('should call writeTestFileToAthenaOutputBucket and sendQueryCompletedQueueMessage using a default email when a recipient email parameter is not provided', async () => {
    const writeTestDataToAthenaBucketEvent = constructSqsEvent(
      JSON.stringify({
        athenaQueryId: TEST_ATHENA_QUERY_ID,
        fileContents: TEST_FILE_CONTENTS,
        zendeskId: TEST_ZENDESK_ID
      })
    )

    await handler(writeTestDataToAthenaBucketEvent, mockLambdaContext)

    expect(writeTestFileToAthenaOutputBucket).toHaveBeenCalledWith(
      TEST_ATHENA_QUERY_ID,
      TEST_FILE_CONTENTS
    )

    expect(sendQueryCompletedQueueMessage).toHaveBeenCalledWith(
      TEST_ATHENA_QUERY_ID,
      TEST_ZENDESK_ID,
      EXPECTED_DEFAULT_EMAIL_ADDRESS
    )
  })
})
