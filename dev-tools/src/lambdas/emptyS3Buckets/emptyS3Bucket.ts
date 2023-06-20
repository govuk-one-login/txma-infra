import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { logger } from '../../utils/logger'
import { listS3ObjectVersions } from './listS3ObjectVersions'

export const emptyS3Bucket = async (bucketName: string): Promise<void> => {
  const objects = await listS3ObjectVersions({ Bucket: bucketName })
  logger.info(
    `Found ${objects.versions.length + objects.deleteMarkers.length} objects`,
    { bucketName }
  )

  if (objects.versions.length === 0 && objects.deleteMarkers.length === 0) {
    logger.info('No objects to delete', { bucketName })
  } else {
    await Promise.all(
      objects.deleteMarkers.map((object) =>
        deleteObject(bucketName, object.Key, object.VersionId)
      )
    )
    await Promise.all(
      objects.versions.map((object) =>
        deleteObject(bucketName, object.Key, object.VersionId)
      )
    )

    logger.info('Successfully emptied S3 bucket', { bucketName })
  }
}

const deleteObject = async (
  bucketName: string,
  key: string,
  versionId: string
) => {
  const s3Client = new S3Client({ region: process.env['AWS_REGION'] })
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
    VersionId: versionId
  })
  const response = await s3Client.send(command)
  return response
}
