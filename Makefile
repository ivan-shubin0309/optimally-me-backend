.PHONY: build-RuntimeDependenciesLayer
.PHONY: build-SwaggerFunction
.PHONY: build-SessionsFunction
.PHONY: build-UsersFunction
.PHONY: build-AdminsSessionsFunction
.PHONY: build-AdminsVerificationsFunction
.PHONY: build-BiomarkersFunction
.PHONY: build-VerificationsFunction
.PHONY: build-WefitterFunction
.PHONY: build-AdminsUsersFunction
.PHONY: build-AdminsResultsFunction
.PHONY: build-FilesFunction
.PHONY: build-UsersBiomarkersFunction
.PHONY: build-ShopifyFunction
.PHONY: build-UsersBiomarkersResultsFunction
.PHONY: build-HautAiFunction
.PHONY: build-TypeformFunction
.PHONY: build-SamplesFunction
.PHONY: build-UsersDevicesFunction
.PHONY: build-SyncDataPushNotificationFunction
.PHONY: build-UsersWidgetsFunction
.PHONY: build-UsersRecommendationsFunction
.PHONY: build-Hl7Function
.PHONY: build-Hl7ObjectDataGeneratorFunction
.PHONY: build-Hl7ResultFunction
.PHONY: build-Hl7ErrorNotificationsFunction
.PHONY: build-UsersHl7Function
.PHONY: build-FulfillmentCenterFunction
.PHONY: build-AdditionalAuthenticationsFunction
.PHONY: build-Hl7TemplatesFunction
.PHONY: build-DnaAgeFunction
.PHONY: build-UsersDnaAgeFunction


build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	npm install -g modclean
	echo yes | modclean -n default:safe --path="$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json"
	cp ".env.$(NODE_ENV)" "$(ARTIFACTS_DIR)/nodejs/.env.$(NODE_ENV)"
	cp -r "locales" "$(ARTIFACTS_DIR)/nodejs/locales"
	npm install -g @nestjs/cli
	npm install

build-lambda-common:
	rm -rf dist
	nest build $(ENTITY)
	cp -r dist "$(ARTIFACTS_DIR)/"

build-SwaggerFunction:
	$(MAKE) HANDLER=apps/swagger/src/main.ts ENTITY=swagger build-lambda-common

build-SessionsFunction:
	$(MAKE) HANDLER=apps/sessions/src/main.ts ENTITY=sessions build-lambda-common

build-UsersFunction:
	$(MAKE) HANDLER=apps/users/src/main.ts ENTITY=users build-lambda-common

build-AdminsSessionsFunction:
	$(MAKE) HANDLER=apps/admins-sessions/src/main.ts ENTITY=admins-sessions build-lambda-common

build-AdminsVerificationsFunction:
	$(MAKE) HANDLER=apps/admins-verifications/src/main.ts ENTITY=admins-verifications build-lambda-common

build-BiomarkersFunction:
	$(MAKE) HANDLER=apps/biomarkers/src/main.ts ENTITY=biomarkers build-lambda-common

build-VerificationsFunction:
	$(MAKE) HANDLER=apps/verifications/src/main.ts ENTITY=verifications build-lambda-common

build-WefitterFunction:
	$(MAKE) HANDLER=apps/wefitter/src/main.ts ENTITY=wefitter build-lambda-common

build-AdminsUsersFunction:
	$(MAKE) HANDLER=apps/admins-users/src/main.ts ENTITY=admins-users build-lambda-common

build-AdminsResultsFunction:
	$(MAKE) HANDLER=apps/admins-results/src/main.ts ENTITY=admins-results build-lambda-common

build-FilesFunction:
	$(MAKE) HANDLER=apps/files/src/main.ts ENTITY=files build-lambda-common

build-UsersBiomarkersFunction:
	$(MAKE) HANDLER=apps/users-biomarkers/src/main.ts ENTITY=users-biomarkers build-lambda-common
	
build-ShopifyFunction:
	$(MAKE) HANDLER=apps/shopify/src/main.ts ENTITY=shopify build-lambda-common

build-UsersBiomarkersResultsFunction:
	$(MAKE) HANDLER=apps/users-results/src/main.ts ENTITY=users-results build-lambda-common
	
build-HautAiFunction:
	$(MAKE) HANDLER=apps/haut-ai/src/main.ts ENTITY=haut-ai build-lambda-common

build-TypeformFunction:
	$(MAKE) HANDLER=apps/typeform/src/main.ts ENTITY=typeform build-lambda-common

build-SamplesFunction:
	$(MAKE) HANDLER=apps/samples/src/main.ts ENTITY=samples build-lambda-common

build-UsersDevicesFunction:
	$(MAKE) HANDLER=apps/users-devices/src/main.ts ENTITY=users-devices build-lambda-common

build-SyncDataPushNotificationFunction:
	$(MAKE) HANDLER=apps/data-sync-notification-cron/src/main.ts ENTITY=data-sync-notification-cron build-lambda-common

build-UsersWidgetsFunction:
	$(MAKE) HANDLER=apps/users-widgets/src/main.ts ENTITY=users-widgets build-lambda-common

build-UsersRecommendationsFunction:
	$(MAKE) HANDLER=apps/users-recommendations/src/main.ts ENTITY=users-recommendations build-lambda-common

build-Hl7Function:
	$(MAKE) HANDLER=apps/hl7/src/main.ts ENTITY=hl7 build-lambda-common

build-Hl7ObjectDataGeneratorFunction:
	$(MAKE) HANDLER=apps/hl7-object-data-generator-cron/src/main.ts ENTITY=hl7-object-data-generator-cron build-lambda-common

build-Hl7ResultFunction:
	$(MAKE) HANDLER=apps/hl7-result-cron/src/main.ts ENTITY=hl7-result-cron build-lambda-common

build-Hl7ErrorNotificationsFunction:
	$(MAKE) HANDLER=apps/hl7-error-notifications/src/main.ts ENTITY=hl7-error-notifications build-lambda-common

build-UsersHl7Function:
	$(MAKE) HANDLER=apps/users-hl7/src/main.ts ENTITY=users-hl7 build-lambda-common

build-FulfillmentCenterFunction:
	$(MAKE) HANDLER=apps/fulfillment-center/src/main.ts ENTITY=fulfillment-center build-lambda-common

build-AdditionalAuthenticationsFunction:
	$(MAKE) HANDLER=apps/additional-authentications/src/main.ts ENTITY=additional-authentications build-lambda-common

build-Hl7TemplatesFunction:
	$(MAKE) HANDLER=apps/hl7-templates/src/main.ts ENTITY=hl7-templates build-lambda-common

build-DnaAgeFunction:
	$(MAKE) HANDLER=apps/dna-age/src/main.ts ENTITY=dna-age build-lambda-common

build-UsersDnaAgeFunction:
	$(MAKE) HANDLER=apps/users-dna-age/src/main.ts ENTITY=users-dna-age build-lambda-common