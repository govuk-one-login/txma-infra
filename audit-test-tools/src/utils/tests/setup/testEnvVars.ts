import {
  TEST_ATHENA_OUTPUT_BUCKET_NAME,
  TEST_QUERY_COMPLETED_QUEUE_URL
} from '../testConstants'

process.env.ATHENA_OUTPUT_BUCKET_NAME = TEST_ATHENA_OUTPUT_BUCKET_NAME
process.env.QUERY_COMPLETED_QUEUE_URL = TEST_QUERY_COMPLETED_QUEUE_URL
process.env.AWS_REGION = 'eu-west-2'
