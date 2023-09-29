import { HeadObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '../../sharedServices/s3/s3Client'
import { S3FileDetails } from '../../types/s3FileDetails'

export const handler = (s3FileDetails: S3FileDetails) => {
  return s3FileExists(s3FileDetails)
}

const s3FileExists = async (s3FileDetails: S3FileDetails): Promise<boolean> => {
  try {
    const headObjectResponse = await s3Client.send(
      new HeadObjectCommand({
        Bucket: s3FileDetails.bucketName,
        Key: s3FileDetails.key
      })
    )

    return !!headObjectResponse.ContentLength
  } catch (err) {
    const notFoundError = err as { name: string }
    if (notFoundError && notFoundError.name === 'NotFound') {
      return false
    }
    throw err
  }
}
