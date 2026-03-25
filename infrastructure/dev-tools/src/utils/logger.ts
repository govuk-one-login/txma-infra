import { Logger } from '@aws-lambda-powertools/logger'
import type { LogLevel } from '@aws-lambda-powertools/logger/types'
import { Context } from 'aws-lambda'

const loggerInstance = new Logger({
  ...(process.env.AWS_LAMBDA_FUNCTION_NAME && {
    serviceName: process.env.AWS_LAMBDA_FUNCTION_NAME
  }),
  logLevel: (process.env.LOG_LEVEL as LogLevel | undefined) ?? 'DEBUG',
  ...(process.env.ENVIRONMENT && { environment: process.env.ENVIRONMENT })
})

export const initialiseLogger = (context: Context) => {
  loggerInstance.addContext(context)
}

export const removeLoggerKeys = (keys: string[]) => {
  loggerInstance.removeKeys(keys)
}

export const appendKeyAttributeDataToLogger = (
  key: Record<string, unknown>
) => {
  loggerInstance.appendKeys(key)
}

export const logger = loggerInstance
