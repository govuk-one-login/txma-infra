export const ERROR_CODES = {
  AT001: 'AT001', // Handler failed - write test data to Athena bucket
  AT002: 'AT002', // No data in SQS event
  AT003: 'AT003', // No body found in SQS event record
  AT004: 'AT004', // Event data was not of the correct type
  AT005: 'AT005', // Error parsing JSON body
  AT006: 'AT006' // Handler failed - write test file to Athena output bucket
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
