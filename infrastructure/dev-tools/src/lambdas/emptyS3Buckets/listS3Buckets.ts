import {
  CloudFormationClient,
  ListStackResourcesCommand
} from '@aws-sdk/client-cloudformation'

export const listS3Buckets = async (stackId: string): Promise<string[]> => {
  const client = new CloudFormationClient({ region: process.env['AWS_REGION'] })
  const command = new ListStackResourcesCommand({ StackName: stackId })
  const response = await client.send(command)

  if (!response.StackResourceSummaries) return []

  const filteredResources = response.StackResourceSummaries.filter(
    (resource) => {
      return resource.ResourceType === 'AWS::S3::Bucket'
    }
  )

  return filteredResources.map((resource) => {
    return resource.PhysicalResourceId
  }) as string[]
}
