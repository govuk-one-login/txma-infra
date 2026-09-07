import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda'
import { emptyS3Bucket } from './emptyS3Bucket.js'
import { listS3Buckets } from './listS3Buckets.js'
import axios from 'axios'
import {
  appendKeyAttributeDataToLogger,
  initialiseLogger,
  logger
} from '../../utils/logger.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (
  event: CloudFormationCustomResourceEvent,
  context: Context
): Promise<void> => {
  initialiseLogger(context)

  const stackId = event.StackId
  appendKeyAttributeDataToLogger({ stackId })

  const startTime = Date.now()
  logger.info('Handler started', { requestType: event.RequestType })

  try {
    if (event.RequestType !== 'Delete') {
      logger.info('RequestType is not Delete, skipping bucket empty')
      return await sendResponse(event, 'SUCCESS')
    }

    logger.info('Delete event received, attempting to empty S3 buckets')

    const s3Buckets = await listS3Buckets(stackId)

    if (s3Buckets.length === 0) {
      logger.info('No S3 buckets found for stack')
      return await sendResponse(event, 'SUCCESS')
    }

    logger.info('S3 buckets found for stack', { bucketCount: s3Buckets.length })

    await Promise.all(s3Buckets.map((bucket) => emptyS3Bucket(bucket)))

    await sendResponse(event, 'SUCCESS')
    logger.info('Handler completed', {
      outcome: 'success',
      duration: Date.now() - startTime
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Handler failed', {
        outcome: 'failure',
        duration: Date.now() - startTime,
        error: {
          code: ERROR_CODES.DT001,
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      })
      await sendResponse(event, 'FAILED', error.message)
    } else {
      logger.error('Handler failed with unknown error', {
        outcome: 'failure',
        duration: Date.now() - startTime,
        error: { code: ERROR_CODES.DT001, message: 'Unknown error' }
      })
      await sendResponse(event, 'FAILED', 'Unknown error')
    }
  }
}

const sendResponse = async (
  event: CloudFormationCustomResourceEvent,
  status: 'SUCCESS' | 'FAILED',
  reason?: string
) => {
  const data = {
    LogicalResourceId: event.LogicalResourceId,
    Reason: reason,
    RequestId: event.RequestId,
    Status: status,
    StackId: event.StackId,
    PhysicalResourceId:
      'PhysicalResourceId' in event
        ? event.PhysicalResourceId
        : formatStackId(event.StackId)
  }

  await axios.put(event.ResponseURL, data)
}

const formatStackId = (stackId: string): string => {
  const splitStackId = stackId.split('stack/')
  const shortStackId =
    splitStackId.length > 0 ? splitStackId[1] : splitStackId[0]
  return `${shortStackId}-custom-resource`
}
