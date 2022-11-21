import { OperationParams } from '../../types/dynamoDbOperation'

export const dynamoDbDelete = async (operationParams: OperationParams) => {
  console.log(
    'DynamoDbGet function.',
    operationParams.zendeskId,
    operationParams.attributeName
  )
}
