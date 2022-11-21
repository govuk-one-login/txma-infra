import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { getEnv } from '../../utils/getEnv'

export const dynamoDbClient = new DynamoDBClient({
  region: getEnv('AWS_REGION')
})
