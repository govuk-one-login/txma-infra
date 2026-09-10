import {
  DeleteObjectCommand,
  HeadBucketCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { logger } from '../../utils/logger.js'
import { listS3ObjectVersions } from './listS3ObjectVersions.js'
import { getEnv } from '../../utils/getEnv.js'

export const emptyS3Bucket = async (bucketName: string): Promise<void> => {
  const s3Client = new S3Client({ region: getEnv('AWS_REGION') })

  if (!(await bucketExists(s3Client, bucketName))) {
    logger.info('Bucket does not exist, skipping', { bucketName })
    return
  }

  const objects = await listS3ObjectVersions({ Bucket: bucketName })
  const objectCount = objects.versions.length + objects.deleteMarkers.length

  logger.info('Objects found in bucket', { bucketName, objectCount })

  if (objects.versions.length === 0 && objects.deleteMarkers.length === 0) {
    logger.info('No objects to delete', { bucketName })
    return
  }

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

const bucketExists = async (
  s3Client: S3Client,
  bucketName: string
): Promise<boolean> => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
    return true
  } catch (error: unknown) {
    if (isBucketNotFoundError(error)) {
      logger.warn('Bucket not found', { bucketName })
      return false
    }

    logger.error('Unable to access bucket', {
      bucketName,
      error: error instanceof Error ? error.name : 'Unknown error'
    })
    throw error
  }
}

const isBucketNotFoundError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false
  }

  const statusCode = (error as { $metadata?: { httpStatusCode?: number } })
    .$metadata?.httpStatusCode

  return (
    error.name === 'NotFound' ||
    error.name === 'NoSuchBucket' ||
    statusCode === 404
  )
}

const deleteObject = async (
  bucketName: string,
  key: string,
  versionId: string
) => {
  const s3Client = new S3Client({
    ...(process.env['AWS_REGION'] && { region: process.env['AWS_REGION'] })
  })
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
    VersionId: versionId
  })
  const response = await s3Client.send(command)
  return response
}
