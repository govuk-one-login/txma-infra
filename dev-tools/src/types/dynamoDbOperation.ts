export interface DynamoDbOperation {
  operation: 'GET' | 'PUT' | 'DELETE'
  params: OperationParams
}

export interface OperationParams {
  zendeskId: string
  attributeName?: string
}
