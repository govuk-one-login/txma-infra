export const TEST_DYNAMO_TABLE_NAME = 'TEST_DYNAMODB_TABLE'
export const TEST_ATHENA_QUERY_ID = '54321'

// export const TEST_ITEM: Record<string, AttributeValue> = {
//   requestInfo: {
//     M: {
//       recipientEmail: { S: 'test@test.gov.uk' },
//       recipientName: { S: 'test' },
//       requesterEmail: { S: 'test@test.gov.uk' },
//       requesterName: { S: 'test' },
//       dateTo: { S: '2022-09-06' },
//       identifierType: { S: 'eventId' },
//       dateFrom: { S: '2022-09-06' },
//       zendeskId: { S: '12' },
//       eventIds: { L: [{ S: '234gh24' }, { S: '98h98bc' }] },
//       piiTypes: { L: [{ S: 'passport_number' }] }
//     }
//   },
//   zendeskId: { S: '12' },
//   athenaQueryId: { S: TEST_ATHENA_QUERY_ID }
// }
export const TEST_ITEM = {
  aKey: 'aValue',
  anotherKey: 'anotherValue'
}

export const TEST_VERSION_ID = 'aTestObjectVersionId123'
export const TEST_KEY = { testKey: 'aTestObjectKey' }
export const TEST_LIST_OF_S3_OBJECT_VERSIONS = {
  versions: [
    {
      Key: TEST_KEY,
      VersionId: TEST_VERSION_ID
    },
    {
      Key: TEST_KEY,
      VersionId: TEST_VERSION_ID
    }
  ],
  deleteMarkers: [
    {
      Key: TEST_KEY,
      VersionId: TEST_VERSION_ID
    },
    {
      Key: TEST_KEY,
      VersionId: TEST_VERSION_ID
    }
  ]
}
