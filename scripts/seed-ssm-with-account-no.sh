#!/bin/bash

# This script assumes you have logged in to aws and have set all requires env vars
# such as AWS_PROFILE

# Check if an account number was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <account_number>"
    exit 1
fi

ACCOUNT_NUMBER=$1
PARAMETER_NAME="txma-audit-account-number"
REGION="eu-west-2"

echo "---"
echo "Updating AWS SSM Parameter: $PARAMETER_NAME"
echo "Value: $ACCOUNT_NUMBER"
echo "---"

# Execute the AWS CLI command
aws ssm put-parameter \
    --name "$PARAMETER_NAME" \
    --value "$ACCOUNT_NUMBER" \
    --type "String" \
    --overwrite \
    --region "$REGION"

# Check if the command succeeded
if [ $? -eq 0 ]; then
    echo "Success: Parameter updated successfully."
else
    echo "Error: Failed to update parameter. Check your SSO login and permissions."
    exit 1
fi
