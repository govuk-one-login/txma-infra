import { Context } from 'aws-lambda'
//console.logs in here

export const mockLambdaContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'someFunction',
  functionVersion: 'someVersion',
  invokedFunctionArn: 'someFunctionArn',
  memoryLimitInMB: '1',
  awsRequestId: 'someRequestId',
  logGroupName: 'someLogGroupName',
  logStreamName: 'someLogStreamName',
  getRemainingTimeInMillis: () => 1,
  done: jest.fn(),
  fail: jest.fn(),
  succeed: jest.fn()
}
