#!/bin/bash

echo $CONFIG_FILE
echo $PWD
cat <<EOT >> $CONFIG_FILE
SWAGGER_BACKEND_URL = $SWAGGER_BACKEND_URL
SWAGGER_TITLE = $SWAGGER_TITLE
DB_HOST = $DB_HOST
DB_PORT = $DB_PORT
DB_USER = $DB_USER
DB_PASSWORD = $DB_PASSWORD
DB_NAME = $DB_NAME
JWT_SECRET = $JWT_SECRET
JWT_EXPIRES_IN = $JWT_EXPIRES_IN
REDIS_HOST = $REDIS_HOST
REDIS_PORT = $REDIS_PORT
REDIS_DB =
REDIS_PASSWORD =
REDIS_PREFIX = $REDIS_PREFIX
CORS_ORIGINS = $CORS_ORIGINS
SES_REGION = $SES_REGION
SES_SOURCE_EMAIL = $SES_SOURCE_EMAIL
AWS_ACCESS_KEY_ID = $AWS_ACCESS_KEY_IDS
AWS_SECRET_ACCESS_KEY = $AWS_SECRET_ACCESS_KEYS
ADMIN_FRONTEND_BASE_URL = $ADMIN_FRONTEND_BASE_URL
EOT
