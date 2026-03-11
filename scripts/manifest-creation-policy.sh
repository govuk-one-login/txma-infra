#!/bin/bash

# this script will need to be amended if not using dev account.
# this also assumes that you are currently logged into aws and have env vars set correctly

# Configuration
BUCKET_NAME="audit-dev-permanent-message-batch"
POLICY='{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "InventoryAndAnalyticsExamplePolicy",
            "Effect": "Allow",
            "Principal": {
                "Service": "s3.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::audit-dev-permanent-message-batch/*",
            "Condition": {
                "StringEquals": {
                    "aws:SourceAccount": "725018305812",
                    "s3:x-amz-acl": "bucket-owner-full-control"
                },
                "ArnLike": {
                    "aws:SourceArn": "arn:aws:s3:::audit-dev-permanent-message-batch"
                }
            }
        }
    ]
}'

# Apply policy
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$POLICY"

if [ $? -eq 0 ]; then
    echo "Success: Policy applied to $BUCKET_NAME"
else
    echo "Error: Failed to apply policy"
fi
