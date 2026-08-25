import {
  CloudFormationClient,
  ListStackResourcesCommand,
  StackResourceSummary
} from '@aws-sdk/client-cloudformation'
import { getEnv } from '../../utils/getEnv.js'

export const listS3Buckets = async (stackId: string): Promise<string[]> => {
  const client = new CloudFormationClient({ region: getEnv('AWS_REGION') })
  const allResources: StackResourceSummary[] = []
  let nextToken: string | undefined

  do {
    const command = new ListStackResourcesCommand({
      StackName: stackId,
      NextToken: nextToken
    })
    const response = await client.send(command)

    if (response.StackResourceSummaries) {
      allResources.push(...response.StackResourceSummaries)
    }

    nextToken = response.NextToken
  } while (nextToken)

  const filteredResources = allResources.filter(
    (resource) => resource.ResourceType === 'AWS::S3::Bucket'
  )

  return filteredResources.map(
    (resource) => resource.PhysicalResourceId
  ) as string[]
}
