import { AttributeValue } from '@aws-sdk/client-dynamodb'

export interface DynamoDbOperation {
  operation: Operation
  params: OperationParams
}

export interface OperationParams {
  zendeskId?: string
  attributeName?: string
  itemToPut?: Record<string, AttributeValue>
}

export type Operation = 'GET' | 'PUT' | 'DELETE'
