import {
  ListObjectVersionsCommand,
  ListObjectVersionsCommandInput,
  ListObjectVersionsCommandOutput,
  S3Client
} from '@aws-sdk/client-s3'

export const listS3ObjectVersions = async (
  input: ListObjectVersionsCommandInput,
  objectVersions: S3ObjectVersions = { deleteMarkers: [], versions: [] }
) => {
  const client = new S3Client({ region: process.env['AWS_REGION'] })
  const command = new ListObjectVersionsCommand(input)
  const response = await client.send(command)

  response.Versions?.forEach((item) =>
    objectVersions.versions.push({
      Key: item.Key as string,
      VersionId: item.VersionId as string
    })
  )

  response.DeleteMarkers?.forEach((item) =>
    objectVersions.deleteMarkers.push({
      Key: item.Key as string,
      VersionId: item.VersionId as string
    })
  )

  if (isPaginated(response)) {
    input.VersionIdMarker = response.NextVersionIdMarker || undefined
    input.KeyMarker = response.NextKeyMarker || undefined
    await listS3ObjectVersions(input, objectVersions)
  }

  return objectVersions
}

const isPaginated = (response: ListObjectVersionsCommandOutput) => {
  return (
    response.IsTruncated &&
    (response.NextKeyMarker || response.NextVersionIdMarker)
  )
}

interface S3ObjectVersions {
  deleteMarkers: { Key: string; VersionId: string }[]
  versions: { Key: string; VersionId: string }[]
}
