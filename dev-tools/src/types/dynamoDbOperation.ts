export interface DynamoDbOperation {
  operation: Operation
  params: OperationParams
}

export interface OperationParams {
  tableName: string
  key?: Record<string, unknown>
  desiredAttributeName?: string
  itemToPut?: Record<string, unknown>
}

export type Operation = 'GET' | 'PUT' | 'DELETE'
