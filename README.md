# TxMA Infrastructure

Infrastructure for querying data in Transaction Monitoring & Audit. There is an additional README for each stack.

## Pre-requisites

To run this project you will need the following:

- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) - Used to build and deploy the application
- [Node.js](https://nodejs.org/en/) version 22 - Recommended way to install is via [NVM](https://github.com/nvm-sh/nvm)
- [Docker](https://docs.docker.com/get-docker/) - Required to run SAM locally
- [Checkov](https://www.checkov.io/) - Scans cloud infrastructure configurations to find misconfigurations before they're deployed. Added as a Husky pre-commit hook.

### Important

- **Node version 22** is required since the runtimes for Lambda functions are fixed.

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

## Licence

[MIT License](LICENCE)
