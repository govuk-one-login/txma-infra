# TxMA Infrastructure

Infrastructure for querying data in Transaction Monitoring & Audit. There is an additional README for each stack.

## Pre-requisites

To run this project you will need the following:

- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) - Used to build and deploy the application
- [Node.js](https://nodejs.org/en/) version 24 - Recommended way to install is via [NVM](https://github.com/nvm-sh/nvm)
- [Docker](https://docs.docker.com/get-docker/) - Required to run SAM locally
- [Checkov](https://www.checkov.io/) - Scans cloud infrastructure configurations to find misconfigurations before they're deployed. Added as a Husky pre-commit hook.

### Important

- **Node version 24** is required since the runtimes for Lambda functions are fixed.

## Getting started

```
nvm use
npm install
npm run prepare
```

## Code standards

This repository is set up to use [Prettier](https://prettier.io/) for formatting, and [ESLint](https://eslint.org/) to look for problems in any Typescript and Javascript code.

Prettier is an opinionated formatting tool for multiple languages/file formats. Exceptions can be added to the `.prettierrc.json` file.

ESLint is configured to use just its recommended rules via the `.eslintrc.json` file. These can be viewed at:

- [Javscript](https://eslint.org/docs/latest/rules/)
- [Typescript](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts)

Additionally, its code formatting rules are disabled as these are handled by Prettier.

To run the linting:

```
npm run lint
```

## Previewing a stack change set

The `scripts/preview-template.sh` script creates a CloudFormation change set against a live stack and saves the output to the `preview/` folder. This is useful for inspecting what changes will be applied before deploying.

Ensure you are logged in via SSO first:

```
export AWS_PROFILE=<your-profile> && aws sso login
```

Then run:

```
./scripts/preview-template.sh <template-path> <stack-name>
```

For example:

```
./scripts/preview-template.sh infrastructure/audit-dr-london/template.yaml auditdr-infra
```

The change set output is saved to `preview/<stack-name>-changeset.json` and the change set is automatically deleted afterwards.

## Testing

Unit and integration tests are found within;

### infrastructure/audit-test-tools

```
cd infrastructure/audit-test-tools && npx vitest run
```

### infrastructure/dev-tools

```
cd infrastructure/dev-tools && npx vitest run
```

## Error Codes

All Lambda functions use structured error logging with assigned error codes to aid cross-service debugging and CloudWatch Insights queries. Each error log entry includes an `error.code` field.

### dev-tools

| Code    | Description                                | Lambda                  |
| ------- | ------------------------------------------ | ----------------------- |
| `DT001` | Handler failed — empty S3 buckets          | `emptyS3Buckets`        |
| `DT002` | Handler failed due to invalid parameters   | `readS3FileToString`    |
| `DT003` | S3 file not found (`NoSuchKey`)            | `readS3FileToString`    |
| `DT004` | Handler failed due to undefined params     | `dynamoOperations`      |
| `DT005` | Dynamo operation not recognised            | `dynamoOperations`      |
| `DT006` | Handler failed — add Firehose record       | `addFirehoseRecord`     |
| `DT007` | Handler failed due to invalid parameters   | `sqsOperations`         |
| `DT008` | Handler failed — copy S3 file              | `copyS3File`            |
| `DT009` | Handler failed — write zipped string to S3 | `writeZippedStringToS3` |
| `DT010` | Handler failed — S3 operations             | `S3Operations`          |
| `DT011` | Unknown S3 command type                    | `S3Operations`          |
| `DT012` | No message ID returned from SQS            | `sqsOperations`         |

Error codes are defined in [`infrastructure/dev-tools/src/utils/errorCodes.ts`](infrastructure/dev-tools/src/utils/errorCodes.ts).

### audit-test-tools

| Code    | Description                                              | Lambda                        |
| ------- | -------------------------------------------------------- | ----------------------------- |
| `AT001` | Handler failed — write test data to Athena bucket        | `writeTestDataToAthenaBucket` |
| `AT002` | No data in SQS event                                     | `writeTestDataToAthenaBucket` |
| `AT003` | No body found in SQS event record                        | `writeTestDataToAthenaBucket` |
| `AT004` | Event data was not of the correct type                   | `writeTestDataToAthenaBucket` |
| `AT005` | Error parsing JSON body                                  | `writeTestDataToAthenaBucket` |
| `AT006` | Handler failed — write test file to Athena output bucket | `writeTestDataToAthenaBucket` |

Error codes are defined in [`infrastructure/audit-test-tools/src/utils/errorCodes.ts`](infrastructure/audit-test-tools/src/utils/errorCodes.ts).

## Licence

[MIT License](LICENCE)
