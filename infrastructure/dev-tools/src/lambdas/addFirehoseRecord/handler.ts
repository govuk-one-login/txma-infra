import { Context } from 'aws-lambda'
import { FirehosePutOperation } from '../../types/firehosePutOperation.js'
import { jsonToUint8Array } from '../../utils/helpers.js'
import { initialiseLogger, logger } from '../../utils/logger.js'
import { putFirehoseRecord } from './putFirehoseRecord.js'

export const handler = async (
  firehosePutParams: FirehosePutOperation,
  context: Context
) => {
  initialiseLogger(context)
  logger.info('Attempting to putFirehoseRecord', {
    eventId: (firehosePutParams.data as { event_id: string })?.event_id
  })
  const putRecordResponse = await putFirehoseRecord(
    firehosePutParams.firehose,
    jsonToUint8Array(firehosePutParams.data)
  )
  logger.info(`Record added to ${firehosePutParams.firehose}`)

  return putRecordResponse.RecordId
}
