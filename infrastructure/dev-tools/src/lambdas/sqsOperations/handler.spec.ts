import { vi } from 'vitest'
import { describe, it, expect } from 'vitest'
import { SqsOperation } from '../../types/sqsOperation.js'
import { mockLambdaContext } from '../../utils/tests/mocks/mockLambdaContext.js'
import { addMessageToQueue } from './addMessageToQueue.js'
import { handler } from './handler.js'

vi.mock('./addMessageToQueue.js', () => ({
  addMessageToQueue: vi.fn()
}))

describe('sqs operations handler', () => {
  const validParameters = {
    message: 'test message',
    queueUrl: 'https://sqs.eu-west-2.amazonaws.com/123456789012/MyQueue'
  }

  const messageAddedToQueue = () => {
    vi.mocked(addMessageToQueue).mockResolvedValue({
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
    await expect(
      handler({ invalid: 'test' } as unknown as SqsOperation, mockLambdaContext)
    ).rejects.toThrow('Function called with invalid parameters')
  })

  it('returns error when no parameters sent', async () => {
    await expect(
      handler(undefined as unknown as SqsOperation, mockLambdaContext)
    ).rejects.toThrow('Function called with invalid parameters')
  })
})
