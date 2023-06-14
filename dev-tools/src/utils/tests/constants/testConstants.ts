export const TEST_ATHENA_QUERY_ID = '54321'
export const TEST_DESIRED_ATTRIBUTE_NAME = 'aKeyForAValueIWant'
export const TEST_DYNAMO_TABLE_NAME = 'TEST_DYNAMODB_TABLE'
export const TEST_KEY = 'aTestObjectKey'
export const TEST_VERSION_ID = 'aTestObjectVersionId123'

export const TEST_DYNAMO_KEY = { testKey: 'aTestObjectKey' }
export const TEST_ITEM = {
  aKey: 'aValue',
  anotherKey: 'anotherValue'
}
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
