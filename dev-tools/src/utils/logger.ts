import { Logger } from '@aws-lambda-powertools/logger'
import { LogLevel } from '@aws-lambda-powertools/logger/lib/types'
import { Context } from 'aws-lambda'

const loggerInstance = new Logger({
  serviceName: process.env.AWS_LAMBDA_FUNCTION_NAME,
  logLevel: (process.env.LOG_LEVEL as LogLevel | undefined) || 'DEBUG',
  environment: process.env.ENVIRONMENT
})

export const initialiseLogger = (context: Context) => {
  loggerInstance.addContext(context)
  loggerInstance.removeKeys(['zendeskId'])
}

export const appendKeyAttributeDataToLogger = (
  keyAttributeName: string,
  keyAttributeValue: string
) => {
  loggerInstance.appendKeys({ [keyAttributeName]: keyAttributeValue })
}

export const logger = loggerInstance
