# Transaction Monitoring & Audit Dev Tools

Tooling to aid developers. This currently consists of

- a lambda to delete everything in an S3 bucket. This allows us to automatically tear down stacks (an S3 bucket must be empty before you can delete it).
- infrastructure for running integration tests against a feature branch. This allows us to automatically verify that the integration tests work with the same permissions and config as the build environment before merging a PR. The conditions on the template resources should only deploy this to dev accounts.

These are not deployed to integration or production.
