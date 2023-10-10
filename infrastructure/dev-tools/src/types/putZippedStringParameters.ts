import { StorageClass } from '@aws-sdk/client-s3'

export interface PutZippedStringParameters {
  key: string
  bucket: string
  data: string
  storageClass: StorageClass
}
