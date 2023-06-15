import { when } from 'jest-when'
import { DynamoDbOperation, Operation } from '../../types/dynamoDbOperation'
import { logger } from '../../utils/logger'
import {
  TEST_DYNAMO_TABLE_NAME,
  TEST_DYNAMO_KEY,
  TEST_ITEM,
  TEST_DESIRED_ATTRIBUTE_NAME
} from '../../utils/tests/constants/testConstants'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
import { dynamoDbDelete } from './dynamoDbDelete'
import { dynamoDbGet } from './dynamoDbGet'
import { dynamoDbPut } from './dynamoDbPut'
import { handler } from './handler'
import 'aws-sdk-client-mock-jest'

jest.mock('./dynamoDbGet', () => ({
  dynamoDbGet: jest.fn()
}))
jest.mock('./dynamoDbPut', () => ({
  dynamoDbPut: jest.fn()
}))
jest.mock('./dynamoDbDelete', () => ({
  dynamoDbDelete: jest.fn()
}))

describe('dynamo db operations handler', () => {
  beforeEach(() => jest.spyOn(logger, 'info'))

  const generateDynamoOperationParams = (operation: Operation) => {
    return {
      operation,
      params: {
        tableName: TEST_DYNAMO_TABLE_NAME,
        ...(operation === 'GET' && {
          key: TEST_DYNAMO_KEY,
          desiredAttributeName: TEST_DESIRED_ATTRIBUTE_NAME
        }),
        ...(operation === 'PUT' && {
          itemToPut: TEST_ITEM
        }),
        ...(operation === 'DELETE' && {
          key: TEST_DYNAMO_KEY
        })
      }
    }
  }

  const dynamoDbGetReturnsEntry = () => {
    when(dynamoDbGet).mockResolvedValue(TEST_ITEM)
  }

  it('returns a dynamoDbEntry when handler is called with correct GET params', async () => {
    dynamoDbGetReturnsEntry()

    const dynamoDbEntry = await handler(
      generateDynamoOperationParams('GET'),
      mockLambdaContext
    )

    expect(logger.info).toHaveBeenCalledWith(
      'GetItemCommand successfully sent to Dynamo'
    )
    expect(dynamoDbGet).toHaveBeenCalledWith({
      tableName: TEST_DYNAMO_TABLE_NAME,
      key: TEST_DYNAMO_KEY,
      desiredAttributeName: TEST_DESIRED_ATTRIBUTE_NAME
    })
    expect(dynamoDbEntry).toEqual(TEST_ITEM)
  })

  it('calls the dynamoDbPut function when handler is called with PUT operation', async () => {
    await handler(generateDynamoOperationParams('PUT'), mockLambdaContext)

    expect(logger.info).toHaveBeenCalledWith(
      'PutItemCommand successfully sent to Dynamo'
    )
    expect(dynamoDbPut).toHaveBeenCalledWith({
      tableName: TEST_DYNAMO_TABLE_NAME,
      itemToPut: TEST_ITEM
    })
  })

  it('calls the dynamoDbDelete function when handler is called with DELETE operation', async () => {
    await handler(generateDynamoOperationParams('DELETE'), mockLambdaContext)

    expect(logger.info).toHaveBeenCalledWith(
      'DeleteItemCommand successfully sent to Dynamo'
    )
    expect(dynamoDbDelete).toHaveBeenCalledWith({
      tableName: TEST_DYNAMO_TABLE_NAME,
      key: TEST_DYNAMO_KEY
    })
  })

  it('throws an error when dynamo operation is not recognised', () => {
    expect(
      handler(
        generateDynamoOperationParams('something else' as Operation),
        mockLambdaContext
      )
    ).rejects.toThrow('Dynamo operation not recognised')
  })

  it('throws an error when parameter is undefined', () => {
    expect(
      handler(undefined as unknown as DynamoDbOperation, mockLambdaContext)
    ).rejects.toThrow('Function called with undefined params')
  })
})
