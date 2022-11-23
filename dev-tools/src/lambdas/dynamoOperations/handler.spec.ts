import { when } from 'jest-when'
import { DynamoDbOperation } from '../../types/dynamoDbOperation'
import { ZENDESK_TICKET_ID } from '../../utils/tests/constants/testConstants'
import { testFunctionUrlCallEvent } from '../../utils/tests/events/testFunctionUrlCallEvent'
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

describe('handler', () => {
  const generateEventBody = (operationDetails?: DynamoDbOperation) => {
    const eventWithCustomBody = testFunctionUrlCallEvent
    eventWithCustomBody.body = JSON.stringify(operationDetails)
    return eventWithCustomBody
  }
  const generateGetDynamoParams = (attributeName?: string) => {
    return generateEventBody({
      operation: 'GET',
      params: {
        zendeskId: ZENDESK_TICKET_ID,
        ...(attributeName && { attributeName })
      }
    })
  }
  const generatePutDynamoParams = () => {
    return generateEventBody({
      operation: 'PUT',
      params: {
        itemToPut: {
          zendeskId: {
            S: ZENDESK_TICKET_ID
          }
        }
      }
    })
  }
  const generateDeleteDynamoParams = () => {
    return generateEventBody({
      operation: 'DELETE',
      params: {
        zendeskId: ZENDESK_TICKET_ID
      }
    })
  }

  const dynamoDbGetReturnsEntry = () => {
    when(dynamoDbGet).mockResolvedValue({
      zendeskId: { S: ZENDESK_TICKET_ID },
      athenaQueryId: { S: '123' }
    })
  }

  it('returns a dynamoDbEntry when handler is called with correct GET params', async () => {
    dynamoDbGetReturnsEntry()

    const dynamoDbEntry = await handler(generateGetDynamoParams())

    expect(dynamoDbGet).toHaveBeenCalledWith({ zendeskId: ZENDESK_TICKET_ID })
    expect(dynamoDbEntry).toEqual({
      zendeskId: { S: ZENDESK_TICKET_ID },
      athenaQueryId: { S: '123' }
    })
  })

  it('calls the dynamoDbPut function when handler is called with PUT operation', async () => {
    await handler(generatePutDynamoParams())

    expect(dynamoDbPut).toHaveBeenCalledWith({
      itemToPut: { zendeskId: { S: ZENDESK_TICKET_ID } }
    })
  })

  it('calls the dynamoDbDelete function when handler is called with DELETE operation', async () => {
    await handler(generateDeleteDynamoParams())

    expect(dynamoDbDelete).toHaveBeenCalledWith({
      zendeskId: ZENDESK_TICKET_ID
    })
  })

  it('throws an error when dynamo operation is not recognised', () => {
    expect(handler(generateEventBody())).rejects.toThrow(
      'Dynamo operation not recognised'
    )
  })
})
