import {
  DeleteObjectCommand,
  GetBucketVersioningCommand,
  PutBucketVersioningCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { logger } from '../../utils/logger'
import { listS3Files } from './listS3Files'
import { listS3ObjectVersions } from './listS3ObjectVersions'

export const emptyS3Bucket = async (bucketName: string): Promise<void> => {
  if (await versioningStatusEnabled(bucketName)) {
    await deleteObjectVersions(bucketName)
  }
  const objects = await listS3Files({ Bucket: bucketName })
  await Promise.all(
    objects.map((object) => deleteObject(bucketName, object.Key as string))
  )
}

const s3Client = new S3Client({ region: process.env['AWS_REGION'] })

const deleteObjectVersions = async (bucketName: string) => {
  await disableVersioning(bucketName)
  const objectVersions = await listS3ObjectVersions({ Bucket: bucketName })
  await Promise.all(
    objectVersions.deleteMarkers.map((marker) =>
      deleteObject(bucketName, marker)
    )
  )
  await Promise.all(
    objectVersions.versions.map((version) => deleteObject(bucketName, version))
  )
}

const versioningStatusEnabled = async (
  bucketName: string
): Promise<boolean> => {
  const getVersioningCommand = new GetBucketVersioningCommand({
    Bucket: bucketName
  })
  const getVersioningResponse = await s3Client.send(getVersioningCommand)
  return getVersioningResponse.Status == 'Enabled'
}

const disableVersioning = async (bucketName: string) => {
  const suspendVersioningCommand = new PutBucketVersioningCommand({
    Bucket: bucketName,
    VersioningConfiguration: { Status: 'Suspended' }
  })
  const response = await s3Client.send(suspendVersioningCommand)
  logger.info('Attempt to disable versioning', {
    Bucket: bucketName,
    result: response
  })
}

const deleteObject = (bucketName: string, key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key
  })
  const response = s3Client.send(command)
  logger.info('Attempt to delete object', {
    bucket: bucketName,
    key,
    result: response
  })
  return response
}
