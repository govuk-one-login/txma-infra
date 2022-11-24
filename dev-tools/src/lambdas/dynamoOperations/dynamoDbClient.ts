import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export const dynamoDbClient = new DynamoDBClient({
  region: process.env['AWS_REGION']
})
