import { TEST_ATHENA_OUTPUT_BUCKET_NAME } from '../testConstants'

process.env.ATHENA_OUTPUT_BUCKET_NAME = TEST_ATHENA_OUTPUT_BUCKET_NAME
process.env.AWS_REGION = 'eu-west-2'
