import { writeTestFileToAthenaOutputBucket } from './writeTestFileToAthenaOutputBucket'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import 'aws-sdk-client-mock-jest'
import {
  TEST_ATHENA_OUTPUT_BUCKET_NAME,
  TEST_FILE_CONTENTS,
  TEST_ATHENA_QUERY_ID
} from '../../utils/tests/testConstants'

const s3ClientMock = mockClient(S3Client)
describe('writeTestFileToAthenaOutputBucket', () => {
  it('should write the required file contents to the specified file key', async () => {
    await writeTestFileToAthenaOutputBucket(
      TEST_ATHENA_QUERY_ID,
      TEST_FILE_CONTENTS
    )
    expect(s3ClientMock).toHaveReceivedCommandWith(PutObjectCommand, {
      Body: TEST_FILE_CONTENTS,
      Bucket: TEST_ATHENA_OUTPUT_BUCKET_NAME,
      Key: `${TEST_ATHENA_QUERY_ID}.csv`
    })
  })
})
