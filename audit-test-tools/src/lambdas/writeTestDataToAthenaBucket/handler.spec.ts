import { constructSqsEvent } from '../../utils/tests/constructSqsEvent'
import {
  TEST_FILE_CONTENTS,
  TEST_FILE_NAME
} from '../../utils/tests/testConstants'
import { handler } from './handler'
import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket'
jest.mock('./writeTestFileToAthenaOutputBucket', () => ({
  writeTestFileToAthenaOutputBucket: jest.fn()
}))

describe('writeTestDataToAthenaBucket handler', () => {
  it('should throw an appropriate error if there is no data in the event', async () => {
    await expect(handler({ Records: [] })).rejects.toThrow('No data in event')
  })

  it('should throw an appropriate error if the request includes data of the wrong shape', async () => {
    const writeTestDataToAthenaBucketEvent = constructSqsEvent(
      JSON.stringify({ someProperty: 'someValue' })
    )
    await expect(handler(writeTestDataToAthenaBucketEvent)).rejects.toThrow(
      'Event data was not of the correct type'
    )
  })

  it('should call writeTestFileToAthenaOutputBucket with the correct parameters', async () => {
    const writeTestDataToAthenaBucketEvent = constructSqsEvent(
      JSON.stringify({
        fileName: TEST_FILE_NAME,
        fileContents: TEST_FILE_CONTENTS
      })
    )

    await handler(writeTestDataToAthenaBucketEvent)

    expect(writeTestFileToAthenaOutputBucket).toHaveBeenCalledWith(
      TEST_FILE_NAME,
      TEST_FILE_CONTENTS
    )
  })
})
