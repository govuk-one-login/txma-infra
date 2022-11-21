import { OperationParams } from '../../types/dynamoDbOperation'

export const dynamoDbPut = async (operationParams: OperationParams) => {
  console.log(
    'DynamoDbGet function.',
    operationParams.zendeskId,
    operationParams.attributeName
  )
}
