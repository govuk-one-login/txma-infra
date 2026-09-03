import { Context } from 'aws-lambda'
import { FirehosePutOperation } from '../../types/firehosePutOperation.js'
import { jsonToUint8Array } from '../../utils/helpers.js'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { putFirehoseRecord } from './putFirehoseRecord.js'
import { ERROR_CODES } from '../../utils/errorCodes.js'

export const handler = async (
  firehosePutParams: FirehosePutOperation,
  context: Context
) => {
  initialiseLogger(context)

  const startTime = Date.now()
  const eventId = (firehosePutParams.data as { event_id?: string })?.event_id
  logger.info('Handler started', {
    firehoseStream: firehosePutParams.firehose,
    eventId
  })

  try {
    const putRecordResponse = await putFirehoseRecord(
      firehosePutParams.firehose,
      jsonToUint8Array(firehosePutParams.data)
    )

    logger.info('Handler completed', {
      outcome: 'success',
      duration: Date.now() - startTime,
      firehoseStream: firehosePutParams.firehose,
      recordId: putRecordResponse.RecordId
    })

    return putRecordResponse.RecordId
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Handler failed', {
      outcome: 'failure',
      duration: Date.now() - startTime,
      error: {
        code: ERROR_CODES.DT006,
        message: err.message,
        name: err.name,
        stack: err.stack
      }
    })
    throw error
  }
}
