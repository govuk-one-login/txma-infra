export { logger, initialiseLogger } from '@govuk-one-login/dpt-logging'
import { logger } from '@govuk-one-login/dpt-logging'

export const removeLoggerKeys = (keys: string[]) => {
  logger.removeKeys(keys)
}

export const appendKeyAttributeDataToLogger = (
  key: Record<string, unknown>
) => {
  logger.appendKeys(key)
}
