# About

Sets up common infrastructure used for implementing Shared Signals

# Deploying

The CI/CD pipeline will deploy the resources in the dev environment as well as all the other environments from build to production. To manually deploy in the dev environment, you can use the following command:

> the command below can update the main `shared-signals-infra` stack that is managed by the pipeline. You **MUST** change the name of the stack to something other than `shared-signals-infra` to deploy a separate instance of the stack.

```bash
sam deploy --stack-name <REPLACE ME> --parameter-overrides ParameterKey=Environment,ParameterValue=dev --resolve-s3 --capabilities CAPABILITY_NAMED_IAM --template-file "shared-signals/template.yaml"
```
