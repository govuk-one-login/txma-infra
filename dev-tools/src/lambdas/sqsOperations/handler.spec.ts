import { when } from 'jest-when'
import { SqsOperation } from '../../types/sqsOperation'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext'
import { addMessageToQueue } from './addMessageToQueue'
import { handler } from './handler'

jest.mock('./addMessageToQueue', () => ({
  addMessageToQueue: jest.fn()
}))

describe('sqs operations handler', () => {
  const validParameters = {
    message: 'test message',
    queueUrl: 'https://sqs.eu-west-2.amazonaws.com/123456789012/MyQueue'
  }

  const messageAddedToQueue = () => {
    when(addMessageToQueue).mockResolvedValue({
      MessageId: '12345',
      $metadata: {}
    })
  }

  it('returns message id when handler called with valid parameters', async () => {
    messageAddedToQueue()
    const messageId = await handler(validParameters, mockLambdaContext)

    expect(addMessageToQueue).toHaveBeenCalledWith(
      validParameters.message,
      validParameters.queueUrl
    )
    expect(messageId).toEqual('12345')
  })

  it('returns error with invalid parameters', async () => {
    expect(
      handler({ invalid: 'test' } as unknown as SqsOperation, mockLambdaContext)
    ).rejects.toThrow('Function called with invalid parameters')
  })

  it('returns error when no parameters sent', async () => {
    expect(
      handler(undefined as unknown as SqsOperation, mockLambdaContext)
    ).rejects.toThrow('Function called with invalid parameters')
  })
})
