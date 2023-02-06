import { jsonToUint8Array } from '../../utils/helpers'
import { logger } from '../../utils/logger'
import { putFirehoseRecord } from './putFirehoseRecord'

export const handler = async (firehose: string, data: unknown) => {
  logger.info(
    `Function called with following params, firehose delivery stream: ${firehose}, data: ${JSON.stringify(
      data
    )}`
  )

  const putRecordResponse = await putFirehoseRecord(
    firehose,
    jsonToUint8Array(data)
  )
  logger.info(
    `Record added to ${firehose} with id: ${putRecordResponse.RecordId}`
  )

  return putRecordResponse.RecordId
}
