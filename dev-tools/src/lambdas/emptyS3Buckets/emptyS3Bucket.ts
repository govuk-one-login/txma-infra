import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { logger } from '../../utils/logger'
import { listS3ObjectVersions } from './listS3ObjectVersions'

export const emptyS3Bucket = async (bucketName: string): Promise<void> => {
  const objects = await listS3ObjectVersions({ Bucket: bucketName })
  logger.info(
    `Retrieved following objects from ${bucketName}. Attempting deletion.`,
    {
      bucket: bucketName,
      result: objects
    }
  )
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
