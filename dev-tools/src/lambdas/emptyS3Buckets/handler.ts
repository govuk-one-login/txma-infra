import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda'
import { emptyS3Bucket } from './emptyS3Bucket'
import { listS3Buckets } from './listS3Buckets'
import axios from 'axios'
import {
  appendKeyAttributeDataToLogger,
  initialiseLogger,
  logger
} from '../../utils/logger'

export const handler = async (
  event: CloudFormationCustomResourceEvent,
  context: Context
): Promise<void> => {
  initialiseLogger(context)

  const stackId = event.StackId
  appendKeyAttributeDataToLogger({ stackId })

  try {
    if (event.RequestType !== 'Delete') {
      logger.info('RequestType is not Delete')
      return await sendResponse(event, 'SUCCESS')
    }

    logger.info(
      'CloudFormationCustomResourceEvent is Delete. Attempting to empty S3 Buckets'
    )

    const s3Buckets = await listS3Buckets(stackId)

    if (s3Buckets.length === 0) {
      logger.info('No S3 buckets found')
      return await sendResponse(event, 'SUCCESS')
    }
    logger.info(`Found ${s3Buckets.length} S3 bucket(s)`, { s3Buckets })

    await Promise.all(s3Buckets.map((bucket) => emptyS3Bucket(bucket)))

    await sendResponse(event, 'SUCCESS')
    logger.info('Successfully emptied all buckets')
  } catch (error: unknown) {
    if (error instanceof Error) {
      await sendResponse(event, 'FAILED', error.message)
      logger.info('Lambda error occurred', { error })
    } else {
      await sendResponse(event, 'FAILED', 'Unknown error')
      logger.info(`Lambda error occurred with 'Unknown error'`)
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
