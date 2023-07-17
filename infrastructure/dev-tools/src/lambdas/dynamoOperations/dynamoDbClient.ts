import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const dynamoDbClient = new DynamoDBClient({
  region: process.env['AWS_REGION']
})
export const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)
