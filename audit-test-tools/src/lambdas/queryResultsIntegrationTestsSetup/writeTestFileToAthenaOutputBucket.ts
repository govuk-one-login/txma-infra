import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getEnv } from '../../utils/getEnv'

export const writeTestFileToAthenaOutputBucket = (
    fileName: string,
    fileContents: string
): Promise<unknown> => {
  const client = new S3Client(getEnv('AWS_REGION'))
  console.log(`Writing test output file to ${fileName}`)
  return client.send(
    new PutObjectCommand({
      Key: fileName,
      Bucket: getEnv('ATHENA_OUTPUT_BUCKET_NAME'),
      Body: fileContents
    })
  )
}
