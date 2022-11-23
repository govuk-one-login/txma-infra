import { AttributeValue } from 'aws-lambda'

export const ZENDESK_TICKET_ID = '123'
export const QUERY_REQUEST_DYNAMODB_TABLE_NAME =
  'MY_AUDIT_REQUEST_DYNAMODB_TABLE'
export const TEST_ATHENA_QUERY_ID = '54321'

export const MOCK_ITEM: Record<string, AttributeValue> = {
  requestInfo: {
    M: {
      recipientEmail: { S: 'test@test.gov.uk' },
      recipientName: { S: 'test' },
      requesterEmail: { S: 'test@test.gov.uk' },
      requesterName: { S: 'test' },
      dateTo: { S: '2022-09-06' },
      identifierType: { S: 'eventId' },
      dateFrom: { S: '2022-09-06' },
      zendeskId: { S: '12' },
      eventIds: { L: [{ S: '234gh24' }, { S: '98h98bc' }] },
      piiTypes: { L: [{ S: 'passport_number' }] }
    }
  },
  zendeskId: { S: '12' },
  athenaQueryId: { S: TEST_ATHENA_QUERY_ID }
}
