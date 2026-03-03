#!/bin/bash
set -e

TEMPLATE_PATH=$1
STACK_NAME=$2

if [[ -z "$TEMPLATE_PATH" || -z "$STACK_NAME" ]]; then
  echo "Usage: $0 <template-path> <stack-name>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PREVIEW_DIR="$SCRIPT_DIR/../preview"
OUTPUT_FILE="$PREVIEW_DIR/${STACK_NAME}-changeset.json"

mkdir -p "$PREVIEW_DIR"

CHANGE_SET_NAME="local-preview-$$"

cleanup() {
  aws cloudformation delete-change-set \
    --stack-name "$STACK_NAME" \
    --change-set-name "$CHANGE_SET_NAME" 2>/dev/null || true
}
trap cleanup EXIT

echo "Fetching current parameter values from stack: $STACK_NAME"
PARAMETERS=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Parameters[*].ParameterKey' \
  --output text | tr '\t' '\n' | sed 's/.*/ParameterKey=&,UsePreviousValue=true/' | tr '\n' ' ')

echo "Creating change set for stack: $STACK_NAME"
aws cloudformation create-change-set \
  --stack-name "$STACK_NAME" \
  --template-body "file://$TEMPLATE_PATH" \
  --change-set-name "$CHANGE_SET_NAME" \
  --parameters $PARAMETERS \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

echo "Waiting for change set to be created..."
aws cloudformation wait change-set-create-complete \
  --stack-name "$STACK_NAME" \
  --change-set-name "$CHANGE_SET_NAME"

echo "Saving output to $OUTPUT_FILE"
aws cloudformation describe-change-set \
  --stack-name "$STACK_NAME" \
  --change-set-name "$CHANGE_SET_NAME" > "$OUTPUT_FILE"

echo "Done. Output saved to $OUTPUT_FILE"
