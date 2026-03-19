import { vi, describe, expect, it } from 'vitest'

import { DynamoDbOperation, Operation } from '../../types/dynamoDbOperation.js'
import {
  TEST_DYNAMO_TABLE_NAME,
  TEST_DYNAMO_KEY,
  TEST_ITEM,
  TEST_DESIRED_ATTRIBUTE_NAME
} from '../../utils/tests/constants/testConstants.js'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext.js'
import { dynamoDbDelete } from './dynamoDbDelete.js'
import { dynamoDbGet } from './dynamoDbGet.js'
import { dynamoDbPut } from './dynamoDbPut.js'
import { handler } from './handler.js'

vi.mock('../../utils/logger.js', () => ({
  initialiseLogger: vi.fn(),
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() }
}))
vi.mock('./dynamoDbGet.js', () => ({
  dynamoDbGet: vi.fn()
}))
vi.mock('./dynamoDbPut.js', () => ({
  dynamoDbPut: vi.fn()
}))
vi.mock('./dynamoDbDelete.js', () => ({
  dynamoDbDelete: vi.fn()
}))

describe('dynamo db operations handler', () => {
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
    vi.mocked(dynamoDbGet).mockResolvedValue(TEST_ITEM)
  }

  it('returns a dynamoDbEntry when handler is called with correct GET params', async () => {
    dynamoDbGetReturnsEntry()

    const dynamoDbEntry = await handler(
      generateDynamoOperationParams('GET'),
      mockLambdaContext
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

    expect(dynamoDbPut).toHaveBeenCalledWith({
      tableName: TEST_DYNAMO_TABLE_NAME,
      itemToPut: TEST_ITEM
    })
  })

  it('calls the dynamoDbDelete function when handler is called with DELETE operation', async () => {
    await handler(generateDynamoOperationParams('DELETE'), mockLambdaContext)

    expect(dynamoDbDelete).toHaveBeenCalledWith({
      tableName: TEST_DYNAMO_TABLE_NAME,
      key: TEST_DYNAMO_KEY
    })
  })

  it('throws an error when dynamo operation is not recognised', async () => {
    await expect(
      handler(
        generateDynamoOperationParams('something else' as Operation),
        mockLambdaContext
      )
    ).rejects.toThrow('Dynamo operation not recognised')
  })

  it('throws an error when parameter is undefined', async () => {
    await expect(
      handler(undefined as unknown as DynamoDbOperation, mockLambdaContext)
    ).rejects.toThrow('Function called with undefined params')
  })
})
