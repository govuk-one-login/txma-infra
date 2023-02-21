import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  _Object
} from '@aws-sdk/client-s3'
import { logger } from '../../utils/logger'

export const listS3Files = async (
  input: ListObjectsV2CommandInput,
  objects: _Object[] = []
): Promise<_Object[]> => {
  const client = new S3Client({ region: process.env['AWS_REGION'] })
  const command = new ListObjectsV2Command(input)
  const response = await client.send(command)
  logger.info('Attempt to return list of objects found', {
    bucket: input.Bucket,
    result: response
  })
  if (!response.Contents) return []

  response.Contents.forEach((item) => objects.push(item))

  if (response.NextContinuationToken) {
    input.ContinuationToken = response.NextContinuationToken
    await listS3Files(input, objects)
  }

  return objects.filter((o) => !o.Key?.endsWith('/'))
}
