export const ERROR_CODES = {
  DT001: 'DT001', // Handler failed - empty S3 buckets
  DT002: 'DT002', // Handler failed - read S3 file to string
  DT003: 'DT003', // S3 file not found (NoSuchKey)
  DT004: 'DT004', // Handler failed - dynamo operations
  DT005: 'DT005', // Dynamo operation not recognised
  DT006: 'DT006', // Handler failed - add Firehose record
  DT007: 'DT007', // Handler failed - SQS operations
  DT008: 'DT008', // Handler failed - copy S3 file
  DT009: 'DT009', // Handler failed - write zipped string to S3
  DT010: 'DT010', // Handler failed - S3 operations
  DT011: 'DT011', // Unknown S3 command type
  DT012: 'DT012' // No message ID returned from SQS
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
