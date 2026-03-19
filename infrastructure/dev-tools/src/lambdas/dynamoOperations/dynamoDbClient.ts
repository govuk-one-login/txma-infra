import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { getEnv } from '../../utils/getEnv.js'

export const dynamoDbClient = new DynamoDBClient({
  region: getEnv('AWS_REGION')
})
export const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)
