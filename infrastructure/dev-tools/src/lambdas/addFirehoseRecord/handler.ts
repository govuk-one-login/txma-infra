import { Context } from 'aws-lambda'
import { FirehosePutOperation } from '../../types/firehosePutOperation'
import { jsonToUint8Array } from '../../utils/helpers'
import { initialiseLogger, logger } from '../../utils/logger'
import { putFirehoseRecord } from './putFirehoseRecord'

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
