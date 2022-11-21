import { when } from 'jest-when'
import { DynamoDbOperation } from '../../types/dynamoDbOperation'
import { ZENDESK_TICKET_ID } from '../../utils/tests/constants/testConstants'
import { testFunctionUrlCallEvent } from '../../utils/tests/events/testFunctionUrlCallEvent'
import { dynamoDbGet } from './dynamoDbGet'
import { handler } from './handler'

jest.mock('./dynamoDbGet', () => ({
  dynamoDbGet: jest.fn()
}))

describe('handler', () => {
  const generateEventBody = (operationDetails: DynamoDbOperation) => {
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

  it('throws an error when no dynamo')
})
