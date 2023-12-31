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
JWT_PUBLIC_KEY = $JWT_PUBLIC_KEY
JWT_PRIVATE_KEY = $JWT_PRIVATE_KEY
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
AWS_S3_BUCKET = $AWS_S3_BUCKET_CONTENT
AWS_S3_REGION = $AWS_REGION
AWS_S3_DOMAIN = $AWS_S3_DOMAIN
ADMIN_FRONTEND_BASE_URL = $ADMIN_FRONTEND_BASE_URL
FRONTEND_BASE_URL = $FRONTEND_BASE_URL
MOBILE_FRONTEND_BASE_URL = $MOBILE_FRONTEND_BASE_URL
WEFITTER_API_URL = $WEFITTER_API_URL
WEFITTER_PUBLIC_ID = $WEFITTER_PUBLIC_ID
WEFITTER_SECRET = $WEFITTER_SECRET
WEFITTER_TOKEN_DB_KEY = $WEFITTER_TOKEN_DB_KEY
WEFITTER_TOKEN_EXPIRE = $WEFITTER_TOKEN_EXPIRE
SHOPIFY_CUSTOMER_ID = $SHOPIFY_CUSTOMER_ID
SHOPIFY_IDP_IDENTIFIER = $SHOPIFY_IDP_IDENTIFIER
SHOPIFY_WEBHOOK_SECRET = $SHOPIFY_WEBHOOK_SECRET
SHOPIFY_API_ACCESS_TOKEN = $SHOPIFY_API_ACCESS_TOKEN
HAUT_AI_ACCESS_TOKEN = $HAUT_AI_ACCESS_TOKEN
HAUT_AI_COMPANY_ID = $HAUT_AI_COMPANY_ID
HAUT_AI_DATASET_ID = $HAUT_AI_DATASET_ID
HAUT_AI_WEBHOOK_TOKEN = $HAUT_AI_WEBHOOK_TOKEN
JWT_ACCESS_TOKEN_EXPIRES_IN = $JWT_ACCESS_TOKEN_EXPIRES_IN
JWT_REFRESH_TOKEN_EXPIRES_IN = $JWT_REFRESH_TOKEN_EXPIRES_IN
TYPEFORM_SECRET = $TYPEFORM_SECRET
TYPEFORM_PERSONAL_TOKEN = $TYPEFORM_PERSONAL_TOKEN
FIREBASE_PROJECT_ID = $FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL = $FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY = $FIREBASE_PRIVATE_KEY
DECISION_RULES_SOLVER_API_KEY = $DECISION_RULES_SOLVER_API_KEY
DECISION_RULES_RECOMMENDATIONS_ITEM_ID = $DECISION_RULES_RECOMMENDATIONS_ITEM_ID
HL7_FTP_HOST = $HL7_FTP_HOST
HL7_FTP_PORT = $HL7_FTP_PORT
HL7_FTP_USERNAME = $HL7_FTP_USERNAME
HL7_FTP_PASSWORD = $HL7_FTP_PASSWORD
HL7_FTP_ROOT_FOLDER = $HL7_FTP_ROOT_FOLDER
KLAVIYO_API_KEY = $KLAVIYO_API_KEY
FULFILLMENT_CENTER_API_KEY = $FULFILLMENT_CENTER_API_KEY
EOT
