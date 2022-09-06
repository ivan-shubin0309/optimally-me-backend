#!/bin/bash

echo $TOML_FILE
echo $PWD
cat <<EOT >> $TOML_FILE
version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
stack_name = "${STACK_NAME}"
s3_bucket = "${S3_BUCKET}"
region = "${AWS_REGION}"
confirm_changeset = false
capabilities = "CAPABILITY_IAM"
tags = "PROJECT=\"optimally-me-backend\" ENV=\"${NODE_ENV}\""
image_repositories = []
disable_rollback = false
parameter_overrides="NodeEnv=$NODE_ENV AwsRegion=$AWS_REGION AppEnv=$APP_ENV SGid=$SGid SubnetIds=\"$SubnetIds\""
EOT
