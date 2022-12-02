import { when } from 'jest-when'
import { DynamoDbOperation, Operation } from '../../types/dynamoDbOperation'
import {
  QUERY_REQUEST_DYNAMODB_TABLE_NAME,
  ZENDESK_TICKET_ID
} from '../../utils/tests/constants/testConstants'
import { dynamoDbDelete } from './dynamoDbDelete'
import { dynamoDbGet } from './dynamoDbGet'
import { dynamoDbPut } from './dynamoDbPut'
import { handler } from './handler'

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
  const generateDynamoOperationParams = (operation: Operation) => {
    return {
      operation,
      params: {
        tableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
        ...(operation === 'GET' && {
          zendeskId: ZENDESK_TICKET_ID,
          attributeName: 'athenaQueryId'
        }),
        ...(operation === 'PUT' && {
          itemToPut: { zendeskId: { S: ZENDESK_TICKET_ID } }
        }),
        ...(operation === 'DELETE' && {
          zendeskId: ZENDESK_TICKET_ID
        })
      }
    }
  }

  const dynamoDbGetReturnsEntry = () => {
    when(dynamoDbGet).mockResolvedValue({
      zendeskId: { S: ZENDESK_TICKET_ID },
      athenaQueryId: { S: '123' }
    })
  }

  it('returns a dynamoDbEntry when handler is called with correct GET params', async () => {
    dynamoDbGetReturnsEntry()

    const dynamoDbEntry = await handler(generateDynamoOperationParams('GET'))

    expect(dynamoDbGet).toHaveBeenCalledWith({
      tableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
      zendeskId: ZENDESK_TICKET_ID,
      attributeName: 'athenaQueryId'
    })
    expect(dynamoDbEntry).toEqual({
      zendeskId: { S: ZENDESK_TICKET_ID },
      athenaQueryId: { S: '123' }
    })
  })

  it('calls the dynamoDbPut function when handler is called with PUT operation', async () => {
    await handler(generateDynamoOperationParams('PUT'))

    expect(dynamoDbPut).toHaveBeenCalledWith({
      tableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
      itemToPut: { zendeskId: { S: ZENDESK_TICKET_ID } }
    })
  })

  it('calls the dynamoDbDelete function when handler is called with DELETE operation', async () => {
    await handler(generateDynamoOperationParams('DELETE'))

    expect(dynamoDbDelete).toHaveBeenCalledWith({
      tableName: QUERY_REQUEST_DYNAMODB_TABLE_NAME,
      zendeskId: ZENDESK_TICKET_ID
    })
  })

  it('throws an error when dynamo operation is not recognised', () => {
    expect(
      handler(generateDynamoOperationParams('something else' as Operation))
    ).rejects.toThrow('Dynamo operation not recognised')
  })

  it('throws an error when parameter is undefined', () => {
    expect(handler(undefined as unknown as DynamoDbOperation)).rejects.toThrow(
      'Function called with undefined params'
    )
  })
})
